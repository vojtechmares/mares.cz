import { t, type Locale } from "../../i18n";

interface StatItemProps {
  value: string;
  description: string;
}

function StatItem({ value, description }: StatItemProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderLeft: "3px solid #f54a00",
        paddingLeft: "1.5rem",
      }}
    >
      <span
        style={{
          fontFamily: "Inter",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#ffffff",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "Inter",
          fontSize: "1rem",
          color: "#a3a3a3",
          marginTop: "0.25rem",
        }}
      >
        {description}
      </span>
    </div>
  );
}

export function CreateBlogListingImageComponent({
  articleCount,
  tagCount,
  locale = "cs",
}: {
  articleCount: number;
  tagCount: number;
  locale?: Locale;
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
        backgroundColor: "#171717",
        padding: "3.5rem 4rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxWidth: "540px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: 700,
              fontFamily: "IBM Plex Sans",
              fontSize: "3.5rem",
              color: "#ffffff",
              lineHeight: 1.15,
            }}
          >
            <span>{t(locale, "blog.og_heading")}</span>
            <span style={{ color: "#f54a00" }}>{t(locale, "blog.og_heading_accent")}</span>
          </div>
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "1.25rem",
              lineHeight: 1.6,
              fontFamily: "Inter",
              color: "#a3a3a3",
            }}
          >
            {t(locale, "blog.meta_description")}
          </p>
        </div>
        <p
          style={{
            fontSize: "1.25rem",
            fontWeight: 400,
            fontFamily: "Inter",
            color: "#737373",
            marginBottom: 0,
          }}
        >
          mares.cz/blog
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        <StatItem value={String(articleCount)} description={t(locale, "blog.og_article_count_label")} />
        <StatItem value={String(tagCount)} description={t(locale, "blog.og_tag_count_label")} />
      </div>
    </div>
  );
}
