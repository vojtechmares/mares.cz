import type { ReactNode } from "react";

import { join } from "node:path";

import { imageToDataUrl } from "../../lib/opengraph";

function Page({
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
            fontWeight: 700,
            fontSize: "4rem",
            marginBottom: 0,
            paddingBottom: 0,
            color: "#f59e0b",
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
        <p style={{ fontSize: "2rem", fontWeight: 500, fontFamily: "Space Mono" }}>mares.cz/{slug}</p>
      </div>
      <img style={{ position: "absolute", bottom: 0, right: 60 }} alt="" height={600} src={imageData} />
    </div>
  );
}

export async function CreatePageImageComponent({
  slug,
  title,
  description,
}: {
  slug: string;
  title: string;
  description: string;
}): Promise<ReactNode> {
  const avatarSrc = await imageToDataUrl(join(process.cwd(), "./src/images/people/vojtech-mares.png"));

  return <Page slug={slug} title={title} description={description} imageData={avatarSrc} />;
}
