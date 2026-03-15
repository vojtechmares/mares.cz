import type { Article } from "../../interfaces/article";
import { t, type Locale } from "../../i18n";
import { formatDate } from "../../i18n/formatting";

export function ArticleHeader({ article, locale }: { article: Article; locale: Locale }) {
  return (
    <header className="mx-auto mb-8 md:text-lg lg:text-xl">
      <p className="text-zinc-700">
        {article.publishedAt ? formatDate(article.publishedAt, locale) : ""}
        {article.publishedAt?.toDateString() !== article.updatedAt?.toDateString() ? (
          <>
            , {t(locale, "blog.updated")} {article.updatedAt ? formatDate(article.updatedAt, locale) : ""}
          </>
        ) : (
          <></>
        )}
      </p>
    </header>
  );
}
