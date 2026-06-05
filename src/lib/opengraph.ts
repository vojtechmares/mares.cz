import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type ReactNode } from "react";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

let interRegular: Buffer | null = null;
let interBold: Buffer | null = null;

function loadFonts() {
  if (!interRegular) {
    interRegular = readFileSync("./src/fonts/Inter_18pt-Regular.ttf");
  }
  if (!interBold) {
    interBold = readFileSync("./src/fonts/Inter_18pt-Bold.ttf");
  }
  return [
    { name: "Inter", data: interRegular, weight: 400 as const },
    { name: "Inter", data: interBold, weight: 700 as const },
  ];
}

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function getMimeType(filePath: string): string {
  const ext = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
  return MIME_TYPES[ext] || "image/png";
}

export async function imageToDataUrl(imageUrl: string, baseUrl: string | URL): Promise<string> {
  const urlPath = new URL(imageUrl, "http://localhost").pathname;
  const filePath = join("./dist/client", urlPath);

  // In production, read directly from the built client assets on disk.
  // In dev, dist/client doesn't exist so fall back to HTTP fetch.
  if (existsSync(filePath)) {
    const buffer = readFileSync(filePath);
    const contentType = getMimeType(urlPath);
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  }

  const absoluteUrl = new URL(imageUrl, baseUrl).toString();
  const response = await fetch(absoluteUrl);
  const buffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);

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

export async function OpenGraphImageResponse(component: ReactNode, _baseUrl: string | URL): Promise<Response> {
  const fonts = loadFonts();

  const svg = await satori(component, {
    width: 1200,
    height: 630,
    fonts,
  });

  const resvg = new Resvg(svg);
  const pngBuffer = resvg.render().asPng();
  const png = new Uint8Array(pngBuffer.buffer, pngBuffer.byteOffset, pngBuffer.byteLength);

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
