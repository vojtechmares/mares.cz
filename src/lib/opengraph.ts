import { type ReactNode } from "react";
import { ImageResponse } from "workers-og";

// Import fonts as URLs at build time
import interFontRegularUrl from "../fonts/Inter_18pt-Regular.ttf";
import interFontLightUrl from "../fonts/Inter_18pt-Light.ttf";
import interFontBoldUrl from "../fonts/Inter_18pt-Bold.ttf";
import ibmPlexSansFontRegularUrl from "../fonts/IBMPlexSans-Regular.ttf";
import ibmPlexSansFontLightUrl from "../fonts/IBMPlexSans-Light.ttf";
import ibmPlexSansFontBoldUrl from "../fonts/IBMPlexSans-Bold.ttf";

// Use Cloudflare ASSETS binding for self-fetches (avoids network round-trip and
// global_fetch_strictly_public restrictions), falling back to regular fetch in local dev.
async function assetFetch(url: string | URL): Promise<Response> {
  try {
    const { env } = await import("cloudflare:workers");
    if (env?.ASSETS) {
      return env.ASSETS.fetch(typeof url === "string" ? url : url.toString());
    }
  } catch {
    // Not in CF Workers runtime (local dev)
  }
  return fetch(url);
}

// Cache for fetched fonts
let fontsCache: ArrayBuffer[] | null = null;

async function loadFonts(baseUrl: string | URL): Promise<ArrayBuffer[]> {
  if (fontsCache) return fontsCache;

  fontsCache = await Promise.all([
    assetFetch(new URL(interFontRegularUrl, baseUrl)).then((r) => r.arrayBuffer()),
    assetFetch(new URL(interFontLightUrl, baseUrl)).then((r) => r.arrayBuffer()),
    assetFetch(new URL(interFontBoldUrl, baseUrl)).then((r) => r.arrayBuffer()),
    assetFetch(new URL(ibmPlexSansFontRegularUrl, baseUrl)).then((r) => r.arrayBuffer()),
    assetFetch(new URL(ibmPlexSansFontLightUrl, baseUrl)).then((r) => r.arrayBuffer()),
    assetFetch(new URL(ibmPlexSansFontBoldUrl, baseUrl)).then((r) => r.arrayBuffer()),
  ]);

  return fontsCache;
}

export async function imageToDataUrl(imageUrl: string, baseUrl: string | URL): Promise<string> {
  const absoluteUrl = new URL(imageUrl, baseUrl).toString();
  const response = await assetFetch(absoluteUrl);
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

  return new ImageResponse(component, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: interRegular,
        weight: 500,
        style: "normal",
      },
      {
        name: "Inter",
        data: interLight,
        weight: 300,
        style: "normal",
      },
      {
        name: "Inter",
        data: interBold,
        weight: 700,
        style: "normal",
      },
      {
        name: "IBM Plex Sans",
        data: ibmPlexSansRegular,
        weight: 500,
        style: "normal",
      },
      {
        name: "IBM Plex Sans",
        data: ibmPlexSansLight,
        weight: 300,
        style: "normal",
      },
      {
        name: "IBM Plex Sans",
        data: ibmPlexSansBold,
        weight: 700,
        style: "normal",
      },
    ],
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
