import type { ReactNode } from "react";

import { t, type Locale } from "../../i18n";
import { formatArticleCount } from "../../i18n/formatting";
import { OgFrame } from "./frame";
import { displayUrl } from "../../i18n/routes";

// Async and `baseUrl` are part of the signature the card routes call; the card no longer fetches any image.
export async function CreateTagArchiveImageComponent({
  tag,
  articleCount,
  locale = "cs",
}: {
  tag: string;
  articleCount: number;
  baseUrl: string | URL;
  locale?: Locale;
}): Promise<ReactNode> {
  return (
    <OgFrame
      url={displayUrl(`/blog/tag/${tag}`, locale)}
      eyebrow={t(locale, "blog.og_heading")}
      title={`#${tag}`}
      stats={[{ label: t(locale, "og.blog_archive"), value: formatArticleCount(articleCount, locale) }]}
    />
  );
}
