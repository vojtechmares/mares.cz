import { join } from "node:path";

import { imageToDataUrl } from "../../lib/opengraph";

function HomepageImage({ imageData }: { imageData: string }) {
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
          }}
        >
          <span style={{ whiteSpace: "nowrap", color: "#f59e0b" }}>Vojtěch Mareš</span>
          <br />,
        </p>
        <p
          style={{
            fontWeight: 700,
            fontSize: "4rem",
            marginTop: 0,
            paddingTop: 0,
          }}
        >
          DevOps architekt.
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
          Snížím Vaše náklady na infrastrukturu, zbavím Vás technického dluhu. Naučím Váš tým, jak používat moderní
          cloud-native technologie.
        </p>
        <p style={{ fontSize: "2rem", fontWeight: 500, fontFamily: "Space Mono" }}>mares.cz</p>
      </div>
      <img style={{ position: "absolute", bottom: 0, right: 60 }} alt="" height={600} src={imageData} />
    </div>
  );
}

export async function CreateHomepageImageComponent() {
  const avatarSrc = await imageToDataUrl(join(process.cwd(), "./src/images/people/vojtech-mares.png"));

  return <HomepageImage imageData={avatarSrc} />;
}
