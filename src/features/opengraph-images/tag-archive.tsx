import type { ReactNode } from "react";

import { imageToDataUrl } from "../../lib/opengraph";
import avatarImage from "../../images/people/vojtech-mares.png";
import type { Locale } from "../../i18n";
import { formatArticleCount } from "../../i18n/formatting";

function TagArchiveImage({
  tag,
  articleCount,
  imageData,
  locale,
}: {
  tag: string;
  articleCount: number;
  imageData: string;
  locale: Locale;
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
          Blog
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
          #{tag}
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
          {formatArticleCount(articleCount, locale)}
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
          mares.cz/blog/tag/{tag}
        </p>
      </div>
      <img style={{ position: "absolute", bottom: 0, right: 60 }} height={600} alt="" src={imageData} />
    </div>
  );
}

export async function CreateTagArchiveImageComponent({
  tag,
  articleCount,
  baseUrl,
  locale = "cs",
}: {
  tag: string;
  articleCount: number;
  baseUrl: string | URL;
  locale?: Locale;
}): Promise<ReactNode> {
  const avatarSrc = await imageToDataUrl(avatarImage.src, baseUrl);

  return <TagArchiveImage tag={tag} articleCount={articleCount} imageData={avatarSrc} locale={locale} />;
}
