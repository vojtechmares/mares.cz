import type { Article } from "../../interfaces/article";

export function ArticleHeader({ article }: { article: Article }) {
  return (
    <header className="mx-auto mb-8 md:text-lg lg:text-xl">
      <p className="text-zinc-700">
        {article.publishedAt?.toLocaleDateString("cs-CZ", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        {article.publishedAt?.toDateString() !== article.updatedAt?.toDateString() ? (
          <>
            , upraveno:{" "}
            {article.updatedAt?.toLocaleDateString("cs-CZ", {
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
