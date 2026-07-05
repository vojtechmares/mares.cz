import { imageToDataUrl } from "../../lib/opengraph";
import avatarImage from "../../images/people/vojtech-mares.png";
import { t, type Locale } from "../../i18n";

export async function CreateHomepageImageComponent(baseUrl: string | URL, locale: Locale = "cs") {
  const avatarSrc = await imageToDataUrl(avatarImage.src, baseUrl);

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
        color: "#404040",
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
          }}
        >
          <span style={{ whiteSpace: "nowrap", color: "#f54a00" }}>Vojtěch Mareš</span>,
        </p>
        <p
          style={{
            fontFamily: "IBM Plex Sans",
            fontWeight: 700,
            fontSize: "4rem",
            marginTop: 0,
            paddingTop: 0,
          }}
        >
          {t(locale, "hero.role")}
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
          {t(locale, "og.homepage_description")}
        </p>
        <p style={{ fontSize: "2rem", fontWeight: 500, fontFamily: "Inter" }}>mares.cz</p>
      </div>
      <img style={{ position: "absolute", bottom: 0, right: 60 }} alt="" height={600} src={avatarSrc} />
    </div>
  );
}
