import type { ReactNode } from "react";

import { join } from "node:path";

import { imageToDataUrl } from "../../lib/opengraph";

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
        backgroundColor: "white",
        color: "black",
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
          Blog archiv
        </p>
        <p
          style={{
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
          }}
        >
          {articleCount} {articleCount === 1 ? "článek" : articleCount < 5 ? "články" : "článků"}
        </p>
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 500,
            marginBottom: 0,
          }}
        >
          Vojtěch Mareš
        </p>
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: 300,
            marginTop: 0,
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
}: {
  title: string;
  articleCount: number;
  url: string;
}): Promise<ReactNode> {
  const avatarSrc = await imageToDataUrl(join(process.cwd(), "./src/images/people/vojtech-mares.png"));

  return <DateArchiveImage title={title} articleCount={articleCount} url={url} imageData={avatarSrc} />;
}
