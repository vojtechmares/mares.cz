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
 * CORS-blocked, so we inline the fonts as `data:` URLs instead. The woff2 files
 * are read once per isolate through the `ASSETS` binding (no CORS, and they stay
 * out of the JS bundle) and cached.
 *
 * The files are the fontsource subsets of the site's own families (IBM Plex Sans
 * and JetBrains Mono). Czech needs both `latin` and `latin-ext` - ě, š, č, ř, ž, ů
 * live in the latter - and each face keeps its fontsource `unicode-range` so
 * Chrome stitches the two subsets into one family.
 */
const UNICODE_RANGES = {
  latin:
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  "latin-ext":
    "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
} as const;

type FontSubset = keyof typeof UNICODE_RANGES;

const FONT_FACES = [
  { family: "IBM Plex Sans", file: "ibm-plex-sans", weight: 400 },
  { family: "IBM Plex Sans", file: "ibm-plex-sans", weight: 600 },
  { family: "JetBrains Mono", file: "jetbrains-mono", weight: 400 },
] as const;

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
  return `data:font/woff2;base64,${toBase64(await response.arrayBuffer())}`;
}

async function getFontFaceCss(): Promise<string> {
  if (fontFaceCssCache) return fontFaceCssCache;

  const subsets = Object.keys(UNICODE_RANGES) as FontSubset[];
  const faces = await Promise.all(
    FONT_FACES.flatMap(({ family, file, weight }) =>
      subsets.map(async (subset) => {
        const src = await loadFontDataUrl(`${file}-${subset}-${weight}-normal.woff2`);
        return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};src:url('${src}') format('woff2');unicode-range:${UNICODE_RANGES[subset]};}`;
      }),
    ),
  );

  fontFaceCssCache = faces.join("");

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
    `body{font-family:'IBM Plex Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;}` +
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
