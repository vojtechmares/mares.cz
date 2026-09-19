import { imageToDataUrl } from "../../lib/opengraph";
import avatarImage from "../../images/people/vojtech-mares.png";
import { t, type Locale } from "../../i18n";
import { OgFrame } from "./frame";

export async function CreateHomepageImageComponent(baseUrl: string | URL, locale: Locale = "cs") {
  const avatarSrc = await imageToDataUrl(avatarImage.src, baseUrl);

  return (
    <OgFrame
      url="mares.cz"
      title={`Vojtěch Mareš, ${t(locale, "hero.role")}`}
      description={t(locale, "og.homepage_description")}
      portrait={avatarSrc}
    />
  );
}
