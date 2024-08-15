/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og";

export const runtime = "edge";

// Image metadata
export const alt = "Školení";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: { slug: string };
};

async function getTrainingMetadata(slug: string) {
  const { meta }: { meta: any } = await import(
    `@/content/trainings/${slug}.mdx`
  );
  return meta;
}

function withImage(
  slug: string,
  logoSrc: ArrayBuffer,
  meta: any,
): ImageResponse {
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
            Školení {meta.name}
          </p>
          <p tw="mt-6 max-w-2xl text-lg">{meta.description}</p>
          <p style={{ fontSize: "2rem", fontWeight: 500, marginBottom: 0 }}>
            Vojtěch Mareš
          </p>
          <p style={{ fontSize: "1.5rem", fontWeight: 300, marginTop: 0 }}>
            mares.cz/skoleni/{slug}
          </p>
        </div>
        {logoSrc && (
          <img
            style={{ position: "absolute", right: 60 }}
            width="400"
            height="400"
            alt=""
            src={logoSrc as unknown as string}
          />
        )}
      </div>
    ),
  );
}

function withoutImage(slug: string, meta: any): ImageResponse {
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
          <p style={{ fontWeight: 700, fontSize: "4rem" }} tw="text-amber-500">
            Školení {meta.name}
          </p>
          <p tw="mt-6 max-w-5xl text-lg">{meta.description}</p>
          <p style={{ fontSize: "2rem", fontWeight: 500, marginBottom: 0 }}>
            Vojtěch Mareš
          </p>
          <p style={{ fontSize: "1.5rem", fontWeight: 300, marginTop: 0 }}>
            mares.cz/skoleni/{slug}
          </p>
        </div>
      </div>
    ),
  );
}

const imageMap = new Map<string, URL>([
  [
    "kubernetes",
    new URL("../../../images/logos/tools/kubernetes.png", import.meta.url),
  ],
  ["argocd", new URL("../../../images/logos/tools/argo.png", import.meta.url)],
  ["git", new URL("../../../images/logos/tools/git.png", import.meta.url)],
  [
    "terraform",
    new URL("../../../images/logos/tools/terraform.png", import.meta.url),
  ],
]);

// Image generation
export default async function Image({ params }: Props) {
  const trainingMetadata = await getTrainingMetadata(params.slug);

  const imageURL = imageMap.get(params.slug);

  if (!imageURL) {
    return withoutImage(params.slug, trainingMetadata);
  }

  const logoSrc = await fetch(imageURL)
    .then((res) => res.arrayBuffer())
    .catch(() => null);

  if (!logoSrc) {
    return withoutImage(params.slug, trainingMetadata);
  }

  return withImage(params.slug, logoSrc, trainingMetadata);
}
