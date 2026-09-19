import { t, type Locale } from "../../i18n";
import { formatDate } from "../../i18n/formatting";
import { OgFrame } from "./frame";
import { displayUrl } from "../../i18n/routes";
import { bareSlug } from "../../lib/content";

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
  return (
    <OgFrame
      url={displayUrl(`/blog/${bareSlug(slug)}`, locale)}
      eyebrow={t(locale, "blog.og_heading")}
      title={title}
      description={description}
      stats={[
        { label: t(locale, "blog.publish_date"), value: formatDate(publishDate, locale) },
        {
          label: tags.length === 1 ? t(locale, "blog.topic_singular") : t(locale, "blog.topic_plural"),
          value: tags.map((tag) => `#${tag}`).join(" "),
          wide: tags.length > 2,
        },
        { label: t(locale, "blog.reading_time"), value: `${readingTimeMinutes} min` },
      ]}
    />
  );
}
