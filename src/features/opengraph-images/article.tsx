import type { ReactNode } from "react";

import { imageToDataUrl } from "../../lib/opengraph";
import avatarImage from "../../images/people/vojtech-mares.png";

function ArticleImage({
  slug,
  title,
  description,
  imageData,
}: {
  slug: string;
  title: string;
  description: string;
  imageData: string;
}) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center", // flex-end
        justifyContent: "space-between", // space-between
        backgroundColor: "#fafafa",
        color: "#3f3f46",
      }}
    >
      <div
        style={{
          marginLeft: "4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <p
          style={{
            fontWeight: 500,
            fontSize: "2.5rem",
            color: "#f59e0b",
          }}
        >
          Na blogu
        </p>
        <p
          style={{
            fontWeight: 700,
            fontSize: "4rem",
            marginTop: 0,
            maxWidth: "42rem",
          }}
        >
          {title}
        </p>
        <p
          style={{
            marginTop: "1.5rem",
            maxWidth: "32rem",
            fontSize: "18px",
            lineHeight: "1.5556",
            fontFamily: "Space Mono",
          }}
        >
          {description}
        </p>
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 500,
            marginBottom: 0,
            fontFamily: "Space Mono",
          }}
        >
          Vojtěch Mareš
        </p>
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: 300,
            marginTop: 0,
            fontFamily: "Space Mono",
          }}
        >
          mares.cz/blog/{slug}
        </p>
      </div>
      <img style={{ position: "absolute", bottom: 0, right: 60 }} height={600} alt="" src={imageData} />
    </div>
  );
}

export async function CreateArticleImageComponent({
  slug,
  title,
  description,
  baseUrl,
}: {
  slug: string;
  title: string;
  description: string;
  baseUrl: string | URL;
}): Promise<ReactNode> {
  const avatarSrc = await imageToDataUrl(avatarImage.src, baseUrl);

  return <ArticleImage slug={slug} title={title} description={description} imageData={avatarSrc} />;
}
