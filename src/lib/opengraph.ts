import { join } from "node:path";
import { readFile } from "node:fs/promises";

import satori from "satori";
import sharp from "sharp";
import { type ReactNode } from "react";

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
  const interFontRegular = await readFile(
    join(process.cwd(), "./src/fonts/Inter_18pt-Regular.ttf"),
  );
  const interFontLight = await readFile(
    join(process.cwd(), "./src/fonts/Inter_18pt-Light.ttf"),
  );
  const interFontBold = await readFile(
    join(process.cwd(), "./src/fonts/Inter_18pt-Bold.ttf"),
  );

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
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
}
