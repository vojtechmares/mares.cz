import { MarkdownContent } from "../../components/markdown-content";
import type { Article } from "../../interfaces/article";

export async function Article({ article }: { article: Article }) {
  return (
    <article>
      <MarkdownContent content={article.text} />
    </article>
  );
}
