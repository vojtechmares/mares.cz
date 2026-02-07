import type { CollectionEntry } from "astro:content";
import { Fragment } from "react";

import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Link } from "../../components/ui/link";
import { Body } from "../../components/ui/body";

// function localeName(locale: string): null | string {
//   switch (locale) {
//     case "cs":
//       return "Česky";
//     case "en":
//       return "English";
//     default:
//       return null;
//   }
// }

const truncateText = (text: string, maxLength = 120) =>
  text.length > maxLength ? text.slice(0, maxLength).trim() + "…" : text;

export function ArticleGrid({ articles }: { articles: CollectionEntry<"blog">[] }) {
  return (
    <Container>
      <div role="list" className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} variant="surface" className="flex flex-col">
            <div className="mb-4 flex flex-row justify-between">
              {/* prettier-ignore */}
              <Body>{article.data.tags.map((tag) => <Fragment key={tag}><Link href={`/blog/tag/${tag}`}>#{tag}</Link>{" "}</Fragment>)}</Body>
              <Body color="secondary">
                {new Date(article.data.publish_time as Date).toLocaleDateString("cs-CZ", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Body>
            </div>
            <Heading level="h3">{article.data.title}</Heading>
            <Body color="secondary" className="my-4">
              {truncateText(article.data.description)}
            </Body>
            <div className="mt-auto flex justify-end pt-4">
              <Link href={"/blog/" + article.id}>Přečíst si článek →</Link>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
