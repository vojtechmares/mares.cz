import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { type ReactNode } from "react";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import satori from "satori";

let wasmInitialized = false;

async function initResvgWasm() {
  if (!wasmInitialized) {
    await initWasm(fetch("https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm"));
    wasmInitialized = true;
  }
}

export async function imageToDataUrl(filePath: string): Promise<string> {
  const data = await readFile(filePath);
  const ext = filePath.split(".").pop()?.toLowerCase();

  if (ext === "svg") {
    return `data:image/svg+xml;base64,${data.toString("base64")}`;
  } else if (ext === "png") {
    return `data:image/png;base64,${data.toString("base64")}`;
  } else if (ext === "jpg" || ext === "jpeg") {
    return `data:image/jpeg;base64,${data.toString("base64")}`;
  }
  return `data:image/png;base64,${data.toString("base64")}`;
}

export async function OpenGraphImageResponse(component: ReactNode) {
  const png = await renderImage(component);

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

async function renderImage(component: ReactNode) {
  await initResvgWasm();

  const interFontRegular = await readFile(join(process.cwd(), "./src/fonts/Inter_18pt-Regular.ttf"));
  const interFontLight = await readFile(join(process.cwd(), "./src/fonts/Inter_18pt-Light.ttf"));
  const interFontBold = await readFile(join(process.cwd(), "./src/fonts/Inter_18pt-Bold.ttf"));
  const spaceMonoRegular = await readFile(join(process.cwd(), "./src/fonts/SpaceMono-Regular.ttf"));
  const spaceMonoBold = await readFile(join(process.cwd(), "./src/fonts/SpaceMono-Bold.ttf"));

  const svg = await satori(component, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: interFontRegular,
        weight: 500,
      },
      {
        name: "Inter",
        data: interFontLight,
        weight: 300,
      },
      {
        name: "Inter",
        data: interFontBold,
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

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  return resvg.render().asPng();
}
