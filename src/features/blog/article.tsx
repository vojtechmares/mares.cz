import type { Article } from "../../interfaces/article";

import { MarkdownContent } from "../../components/markdown-content";

export async function Article({ article }: { article: Article }) {
  return (
    <article>
      <MarkdownContent content={article.text} />
    </article>
  );
}
