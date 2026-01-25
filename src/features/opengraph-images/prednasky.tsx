import type { ReactNode } from "react";

import { imageToDataUrl } from "../../lib/opengraph";
import avatarImage from "../../images/people/vojtech-mares.png";

function Prednasky({ imageData }: { imageData: string }) {
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
            fontWeight: 700,
            fontSize: "4rem",
            marginBottom: 0,
            paddingBottom: 0,
            color: "#f59e0b",
          }}
        >
          Přednášky
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
          Přehled přednášek a workshopů, které jsem měl možnost dělat.
        </p>
        <p style={{ fontSize: "2rem", fontWeight: 500, fontFamily: "Space Mono" }}>mares.cz/prednasky</p>
      </div>
      <img style={{ position: "absolute", bottom: 0, right: 60 }} alt="" height={600} src={imageData} />
    </div>
  );
}

export async function CreatePrednaskyImageComponent(baseUrl: string | URL): Promise<ReactNode> {
  const avatarSrc = await imageToDataUrl(avatarImage.src, baseUrl);

  return <Prednasky imageData={avatarSrc} />;
}
