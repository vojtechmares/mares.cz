import type { ReactNode } from "react";

import { t, type Locale } from "../../i18n";
import { formatArticleCount } from "../../i18n/formatting";
import { OgFrame } from "./frame";

// Async and `baseUrl` are part of the signature the card routes call; the card no longer fetches any image.
export async function CreateDateArchiveImageComponent({
  title,
  articleCount,
  url,
  locale = "cs",
}: {
  title: string;
  articleCount: number;
  url: string;
  baseUrl: string | URL;
  locale?: Locale;
}): Promise<ReactNode> {
  return (
    <OgFrame
      url={url}
      eyebrow={t(locale, "og.blog_archive")}
      title={title}
      stats={[{ label: t(locale, "blog.og_article_count_label"), value: formatArticleCount(articleCount, locale) }]}
    />
  );
}
