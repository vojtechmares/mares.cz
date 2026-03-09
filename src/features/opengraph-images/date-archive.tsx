import type { ReactNode } from "react";

import { imageToDataUrl } from "../../lib/opengraph";
import avatarImage from "../../images/people/vojtech-mares.png";

function DateArchiveImage({
  title,
  articleCount,
  url,
  imageData,
}: {
  title: string;
  articleCount: number;
  url: string;
  imageData: string;
}) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
            fontFamily: "IBM Plex Sans",
            fontWeight: 500,
            fontSize: "2.5rem",
            color: "#f54a00",
          }}
        >
          Blog archiv
        </p>
        <p
          style={{
            fontFamily: "IBM Plex Sans",
            fontWeight: 700,
            fontSize: "5rem",
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
            fontSize: "1.5rem",
            lineHeight: "1.5556",
            fontFamily: "Inter",
          }}
        >
          {articleCount} {articleCount === 1 ? "článek" : articleCount < 5 ? "články" : "článků"}
        </p>
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 500,
            marginBottom: 0,
            fontFamily: "Inter",
          }}
        >
          Vojtěch Mareš
        </p>
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: 300,
            marginTop: 0,
            fontFamily: "Inter",
          }}
        >
          {url}
        </p>
      </div>
      <img style={{ position: "absolute", bottom: 0, right: 60 }} height={600} alt="" src={imageData} />
    </div>
  );
}

export async function CreateDateArchiveImageComponent({
  title,
  articleCount,
  url,
  baseUrl,
}: {
  title: string;
  articleCount: number;
  url: string;
  baseUrl: string | URL;
}): Promise<ReactNode> {
  const avatarSrc = await imageToDataUrl(avatarImage.src, baseUrl);

  return <DateArchiveImage title={title} articleCount={articleCount} url={url} imageData={avatarSrc} />;
}
