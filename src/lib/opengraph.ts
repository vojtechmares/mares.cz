import { type ReactNode } from "react";
import satori from "satori";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";

// Import fonts as URLs at build time
import interFontRegularUrl from "../fonts/Inter_18pt-Regular.ttf";
import interFontLightUrl from "../fonts/Inter_18pt-Light.ttf";
import interFontBoldUrl from "../fonts/Inter_18pt-Bold.ttf";
import ibmPlexSansFontRegularUrl from "../fonts/IBMPlexSans-Regular.ttf";
import ibmPlexSansFontLightUrl from "../fonts/IBMPlexSans-Light.ttf";
import ibmPlexSansFontBoldUrl from "../fonts/IBMPlexSans-Bold.ttf";

// Cache for fetched fonts
let fontsCache: ArrayBuffer[] | null = null;

async function loadFonts(baseUrl: string | URL): Promise<ArrayBuffer[]> {
  if (fontsCache) return fontsCache;

  fontsCache = await Promise.all([
    fetch(new URL(interFontRegularUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(interFontLightUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(interFontBoldUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(ibmPlexSansFontRegularUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(ibmPlexSansFontLightUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(ibmPlexSansFontBoldUrl, baseUrl)).then((r) => r.arrayBuffer()),
  ]);

  return fontsCache;
}

// Guard against double WASM initialization
let resvgInitialized = false;

async function ensureResvgWasm(): Promise<void> {
  if (resvgInitialized) return;
  try {
    await initWasm(resvgWasm as unknown as WebAssembly.Module);
  } catch (e) {
    if (e instanceof Error && e.message.includes("Already initialized")) {
      // WASM was initialized in a previous module evaluation (e.g. Vite HMR)
    } else {
      throw e;
    }
  }
  resvgInitialized = true;
}

export async function imageToDataUrl(imageUrl: string, baseUrl: string | URL): Promise<string> {
  const absoluteUrl = new URL(imageUrl, baseUrl).toString();
  const response = await fetch(absoluteUrl);
  const buffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);

  // Use chunk-based conversion to avoid stack overflow with large images
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }

  const base64 = btoa(binary);
  const contentType = response.headers.get("content-type") || "image/png";
  return `data:${contentType};base64,${base64}`;
}

export async function OpenGraphImageResponse(component: ReactNode, baseUrl: string | URL) {
  const [interRegular, interLight, interBold, ibmPlexSansRegular, ibmPlexSansLight, ibmPlexSansBold] =
    await loadFonts(baseUrl);

  const width = 1200;
  const height = 630;

  // Render React element to SVG using satori
  const svg = await satori(component, {
    width,
    height,
    fonts: [
      {
        name: "Inter",
        data: interRegular,
        weight: 500,
      },
      {
        name: "Inter",
        data: interLight,
        weight: 300,
      },
      {
        name: "Inter",
        data: interBold,
        weight: 700,
      },
      {
        name: "IBM Plex Sans",
        data: ibmPlexSansRegular,
        weight: 500,
      },
      {
        name: "IBM Plex Sans",
        data: ibmPlexSansLight,
        weight: 300,
      },
      {
        name: "IBM Plex Sans",
        data: ibmPlexSansBold,
        weight: 700,
      },
    ],
  });

  // Convert SVG to PNG using resvg-wasm
  await ensureResvgWasm();
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
