import type { Article } from "@/lib/strapi/types/article";

export function ArticleHeader({ article }: { article: Article }) {
  return (
    <header className="mx-auto mb-8 md:text-lg lg:text-xl">
        <p className="text-slate-700">
          {article.publishedAt.toLocaleDateString("cs-CZ", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {article.publishedAt.toDateString() !==
          article.updatedAt.toDateString() ? (
            <>
              , upraveno:{" "}
              {article.updatedAt.toLocaleDateString("cs-CZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </>
          ) : (
            <></>
          )}
        </p>
    </header>
  );
}
