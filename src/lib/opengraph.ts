import { type ReactNode } from "react";

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

// TODO: Re-implement OG image generation for Node.js (e.g. with @vercel/og or satori + sharp)
export async function OpenGraphImageResponse(_component: ReactNode, _baseUrl: string | URL): Promise<Response> {
  return new Response("OG image generation not yet implemented for Node.js", {
    status: 501,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
    },
  });
}
