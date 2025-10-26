import satori from "satori";
import sharp from "sharp";

import { join } from "node:path";
import { readFile } from "node:fs/promises";

import { CreatePageImageComponent } from "../../components/opengraph-images/page";
import { strapi } from "../../lib/strapi";

// server-side rendered route
export const prerender = false;

export async function GET({ params }: { params: { slug: string } }) {
    const { slug } = params;

    const page = await strapi.getPage(slug);

    const avatarData = await readFile(
        join(process.cwd(), "./src/images/people/vojtech-mares.png")
    );
    const avatarSrc = Uint8Array.from(avatarData).buffer;

    const component = CreatePageImageComponent({
        slug: page.slug,
        title: page.title,
        description: page.description,
        imageData: avatarSrc,
    });

    const interFontRegular = await readFile(
        join(process.cwd(), "./src/fonts/Inter_18pt-Regular.ttf")
    );
    const interFontLight = await readFile(
        join(process.cwd(), "./src/fonts/Inter_18pt-Light.ttf")
    );
    const interFontBold = await readFile(
        join(process.cwd(), "./src/fonts/Inter_18pt-Bold.ttf")
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
    return new Response(png as unknown as ArrayBuffer, {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
}

function toArrayBuffer(buffer: Buffer): ArrayBuffer | SharedArrayBuffer {
    return buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
    );
}
