import { ImageResponse } from "next/og";

export const runtime = "edge";

// Image metadata
export const alt = "Z blogu";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: { slug: string };
};

async function getArticleMetadata(slug: string) {
  const { meta }: { meta: any } = await import(
    `@/content/articles/${slug}.mdx`
  );
  return meta;
}

// Image generation
export default async function Image({ params }: Props) {
  const avatarSrc = await fetch(
    new URL("../../../images/avatars/vojtech-mares.png", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const meta = await getArticleMetadata(params.slug);

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
            style={{ fontWeight: 500, fontSize: "2.5rem" }}
            tw="text-amber-500"
          >
            Z mého blogu
          </p>
          <p style={{ fontWeight: 700, fontSize: "4rem", marginTop: 0 }}>
            {meta.title}
          </p>
          <p tw="mt-6 max-w-xl text-lg">{meta.description}</p>
          <p style={{ fontSize: "2rem", fontWeight: 500, marginBottom: 0 }}>
            Vojtěch Mareš
          </p>
          <p style={{ fontSize: "1.5rem", fontWeight: 300, marginTop: 0 }}>
            mares.cz/clanky/{params.slug}
          </p>
        </div>
        <img
          style={{ position: "absolute", bottom: 0, right: 60 }}
          height="600"
          src={avatarSrc}
        />
      </div>
    ),
  );
}
