import { type ReactNode } from "react";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import satori from "satori";

// Import fonts as URLs at build time
import interFontRegularUrl from "../fonts/Inter_18pt-Regular.ttf";
import interFontLightUrl from "../fonts/Inter_18pt-Light.ttf";
import interFontBoldUrl from "../fonts/Inter_18pt-Bold.ttf";
import spaceMonoRegularUrl from "../fonts/SpaceMono-Regular.ttf";
import spaceMonoBoldUrl from "../fonts/SpaceMono-Bold.ttf";

// WASM URL from CDN
const RESVG_WASM_URL = "https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm";

let wasmInitialized = false;

async function initResvgWasm() {
  if (!wasmInitialized) {
    const wasmResponse = await fetch(RESVG_WASM_URL);
    const wasmBytes = await wasmResponse.arrayBuffer();
    await initWasm(wasmBytes);
    wasmInitialized = true;
  }
}

// Cache for fetched fonts
let fontsCache: {
  interRegular: ArrayBuffer;
  interLight: ArrayBuffer;
  interBold: ArrayBuffer;
  spaceMonoRegular: ArrayBuffer;
  spaceMonoBold: ArrayBuffer;
} | null = null;

async function loadFonts(baseUrl: string | URL) {
  if (fontsCache) return fontsCache;

  const [interRegular, interLight, interBold, spaceMonoRegular, spaceMonoBold] = await Promise.all([
    fetch(new URL(interFontRegularUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(interFontLightUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(interFontBoldUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(spaceMonoRegularUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(spaceMonoBoldUrl, baseUrl)).then((r) => r.arrayBuffer()),
  ]);

  fontsCache = { interRegular, interLight, interBold, spaceMonoRegular, spaceMonoBold };
  return fontsCache;
}

export async function imageToDataUrl(imageUrl: string, baseUrl: string | URL): Promise<string> {
  const absoluteUrl = new URL(imageUrl, baseUrl).toString();
  const response = await fetch(absoluteUrl);
  const buffer = await response.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const contentType = response.headers.get("content-type") || "image/png";
  return `data:${contentType};base64,${base64}`;
}

export async function OpenGraphImageResponse(component: ReactNode, baseUrl: string | URL) {
  const png = await renderImage(component, baseUrl);

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

async function renderImage(component: ReactNode, baseUrl: string | URL) {
  await initResvgWasm();
  const fonts = await loadFonts(baseUrl);

  const svg = await satori(component, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: fonts.interRegular,
        weight: 500,
      },
      {
        name: "Inter",
        data: fonts.interLight,
        weight: 300,
      },
      {
        name: "Inter",
        data: fonts.interBold,
        weight: 700,
      },
      {
        name: "Space Mono",
        data: fonts.spaceMonoRegular,
        weight: 400,
      },
      {
        name: "Space Mono",
        data: fonts.spaceMonoBold,
        weight: 700,
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  return resvg.render().asPng();
}
