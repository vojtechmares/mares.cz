import type { ReactNode } from "react";

import { imageToDataUrl } from "../../lib/opengraph";
import avatarImage from "../../images/people/vojtech-mares.png";

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
            fontFamily: "IBM Plex Sans",
            fontWeight: 700,
            fontSize: "4rem",
            marginBottom: 0,
            paddingBottom: 0,
            color: "#f54a00",
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
            fontFamily: "Inter",
          }}
        >
          {description}
        </p>
        <p style={{ fontSize: "2rem", fontWeight: 500, fontFamily: "Inter" }}>mares.cz/{slug}</p>
      </div>
      <img style={{ position: "absolute", bottom: 0, right: 60 }} alt="" height={600} src={imageData} />
    </div>
  );
}

export async function CreatePageImageComponent({
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

  return <Page slug={slug} title={title} description={description} imageData={avatarSrc} />;
}
