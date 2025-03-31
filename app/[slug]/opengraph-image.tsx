/* eslint-disable @next/next/no-img-element */

import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { strapi } from "@/lib/strapi/strapi";

// Image metadata
async function getPage(slug: string) {
  const page = await strapi.getPage(slug);
  if (!page) {
    throw new Error("Page not found");
  }

  return page;
}

export async function generateImageMetadata(props: { params: Params }) {
  const { slug } = await props.params;
  const page = await getPage(slug);

  return [
    {
      id: slug,
      alt: page.title,
      size: {
        width: 1200,
        height: 630,
      },
      contentType: "image/png",
    },
  ];
}

type Params = Promise<{ slug: string }>;

// Image generation
export default async function Image(props: { params: Params }) {
  const { slug } = await props.params;
  const page = await getPage(slug);

  const avatarData = await readFile(
    resolve("public/images/people/vojtech-mares.png"),
  );
  const avatarSrc = Uint8Array.from(avatarData).buffer;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center", // flex-end
          justifyContent: "space-between", // space-between
          backgroundColor: "white",
          color: "black",
        }}
      >
        <div tw="ml-16 flex flex-col justify-center h-full">
          <p
            style={{
              fontWeight: 700,
              fontSize: "4rem",
              marginBottom: 0,
              paddingBottom: 0,
            }}
            tw="text-amber-500"
          >
            {page.title}
          </p>
          <p tw="mt-6 max-w-lg text-lg">{page.description}</p>
          <p style={{ fontSize: "2rem", fontWeight: 500 }}>
            mares.cz/{page.slug}
          </p>
        </div>
        <img
          style={{ position: "absolute", bottom: 0, right: 60 }}
          alt=""
          height="600"
          src={avatarSrc as unknown as string}
        />
      </div>
    ),
  );
}
