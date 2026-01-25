import { type ReactNode } from "react";
import { ImageResponse } from "workers-og";

// Import fonts as URLs at build time
import interFontRegularUrl from "../fonts/Inter_18pt-Regular.ttf";
import interFontLightUrl from "../fonts/Inter_18pt-Light.ttf";
import interFontBoldUrl from "../fonts/Inter_18pt-Bold.ttf";
import spaceMonoRegularUrl from "../fonts/SpaceMono-Regular.ttf";
import spaceMonoBoldUrl from "../fonts/SpaceMono-Bold.ttf";

// Cache for fetched fonts
let fontsCache: ArrayBuffer[] | null = null;

async function loadFonts(baseUrl: string | URL): Promise<ArrayBuffer[]> {
  if (fontsCache) return fontsCache;

  fontsCache = await Promise.all([
    fetch(new URL(interFontRegularUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(interFontLightUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(interFontBoldUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(spaceMonoRegularUrl, baseUrl)).then((r) => r.arrayBuffer()),
    fetch(new URL(spaceMonoBoldUrl, baseUrl)).then((r) => r.arrayBuffer()),
  ]);

  return fontsCache;
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
  const [interRegular, interLight, interBold, spaceMonoRegular, spaceMonoBold] = await loadFonts(baseUrl);

  // workers-og's ImageResponse expects the element and options
  const response = new ImageResponse(component, {
    width: 1200,
    height: 630,
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
        name: "Space Mono",
        data: spaceMonoRegular,
        weight: 400,
      },
      {
        name: "Space Mono",
        data: spaceMonoBold,
        weight: 700,
      },
    ],
  });

  // Clone response to add caching headers
  const png = await response.arrayBuffer();
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
