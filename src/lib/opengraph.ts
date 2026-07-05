import { env } from "cloudflare:workers";
import puppeteer from "@cloudflare/puppeteer";
import { type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/**
 * Resolve an image reference to an absolute URL.
 *
 * The Open Graph cards are rendered by a real headless browser (Cloudflare
 * Browser Rendering), so images are fetched over HTTP from the deployed origin
 * instead of being inlined as base64 data URLs the way Satori required.
 */
export async function imageToDataUrl(imageUrl: string, baseUrl: string | URL): Promise<string> {
  return new URL(imageUrl, baseUrl).toString();
}

/**
 * Font faces used by the OG card designs, embedded as base64 data URLs.
 *
 * The cards are rendered from an `about:blank` document (`page.setContent`),
 * which has a null origin. Cross-origin `@font-face` fetches from there are
 * CORS-blocked, so we inline the fonts as `data:` URLs instead. The TTFs are
 * read once per isolate through the `ASSETS` binding (no CORS, and they stay out
 * of the JS bundle) and cached.
 *
 * In production only the Inter TTFs were ever handed to Satori, so any
 * `font-family: "IBM Plex Sans"` in the card components silently fell back to
 * Inter. We reproduce that exact rendering by aliasing both families to Inter.
 */
const FONT_FILES = {
  regular: "Inter_18pt-Regular.ttf",
  bold: "Inter_18pt-Bold.ttf",
} as const;

let fontFaceCssCache: string | null = null;

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function loadFontDataUrl(file: string): Promise<string> {
  const response = await env.ASSETS.fetch(new URL(`/fonts/${file}`, "https://assets.local"));
  return `data:font/ttf;base64,${toBase64(await response.arrayBuffer())}`;
}

async function getFontFaceCss(): Promise<string> {
  if (fontFaceCssCache) return fontFaceCssCache;

  const [regular, bold] = await Promise.all([loadFontDataUrl(FONT_FILES.regular), loadFontDataUrl(FONT_FILES.bold)]);

  const face = (family: string, weight: number, src: string) =>
    `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};src:url('${src}') format('truetype');}`;

  fontFaceCssCache =
    face("Inter", 400, regular) +
    face("Inter", 700, bold) +
    face("IBM Plex Sans", 400, regular) +
    face("IBM Plex Sans", 700, bold);

  return fontFaceCssCache;
}

/**
 * Render a React OG card component to a 1200x630 PNG using Cloudflare Browser
 * Rendering. The component is serialized to static HTML, wrapped in a fixed-size
 * document, and screenshotted by headless Chrome via the `BROWSER` binding.
 */
export async function OpenGraphImageResponse(component: ReactNode, _baseUrl: string | URL): Promise<Response> {
  const [markup, fontFaceCss] = await Promise.all([Promise.resolve(renderToStaticMarkup(component)), getFontFaceCss()]);

  const html =
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>` +
    `*{margin:0;padding:0;box-sizing:border-box;}` +
    fontFaceCss +
    `html,body{width:${OG_WIDTH}px;height:${OG_HEIGHT}px;overflow:hidden;}` +
    `body{font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;}` +
    `</style></head><body>${markup}</body></html>`;

  const browser = await puppeteer.launch(env.BROWSER);
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: OG_WIDTH, height: OG_HEIGHT, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    // Ensure webfonts have finished loading before we capture the frame.
    await page.evaluate(() => document.fonts.ready);

    const png = (await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: OG_WIDTH, height: OG_HEIGHT },
    })) as Uint8Array;

    return new Response(png as unknown as BodyInit, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } finally {
    await browser.close();
  }
}
