import { t, type Locale } from "../../i18n";
import { OgFrame } from "./frame";
import { displayUrl } from "../../i18n/routes";

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
    <OgFrame
      url={displayUrl("/blog", locale)}
      eyebrow={t(locale, "blog.og_heading")}
      title={`${t(locale, "blog.og_heading")} ${t(locale, "blog.og_heading_accent")}`}
      description={t(locale, "blog.meta_description")}
      stats={[
        { label: t(locale, "blog.og_article_count_label"), value: String(articleCount) },
        { label: t(locale, "blog.og_tag_count_label"), value: String(tagCount) },
      ]}
    />
  );
}
