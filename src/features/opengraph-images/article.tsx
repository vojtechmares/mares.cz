import { t, type Locale } from "../../i18n";
import { formatDate } from "../../i18n/formatting";

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
          color: "#a1a1aa",
          marginTop: "0.25rem",
        }}
      >
        {description}
      </span>
    </div>
  );
}

export function CreateArticleImageComponent({
  slug,
  title,
  description,
  publishDate,
  tags,
  readingTimeMinutes,
  locale = "cs",
}: {
  slug: string;
  title: string;
  description: string;
  publishDate: Date;
  tags: string[];
  readingTimeMinutes: number;
  locale?: Locale;
}) {
  const formattedDate = formatDate(publishDate, locale);

  const tagsDisplay = tags.map((tag) => `#${tag}`).join(" ");

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#18181b",
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
              fontSize: "2.75rem",
              color: "#ffffff",
              lineHeight: 1.15,
            }}
          >
            <span>{title}</span>
          </div>
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "1.25rem",
              lineHeight: 1.6,
              fontFamily: "Inter",
              color: "#a1a1aa",
            }}
          >
            {description}
          </p>
        </div>
        <p
          style={{
            fontSize: "1.25rem",
            fontWeight: 400,
            fontFamily: "Inter",
            color: "#71717a",
            marginBottom: 0,
          }}
        >
          mares.cz/blog/{slug}
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
        <StatItem value={formattedDate} description={t(locale, "blog.publish_date")} />
        <StatItem
          value={tagsDisplay}
          description={tags.length === 1 ? t(locale, "blog.topic_singular") : t(locale, "blog.topic_plural")}
        />
        <StatItem value={`${readingTimeMinutes} min`} description={t(locale, "blog.reading_time")} />
      </div>
    </div>
  );
}
