import { Card } from "../../components/ui/card";
import { Heading } from "../../components/ui/heading";
import { Container } from "../../components/ui/container";
import type { CollectionEntry } from "astro:content";
import { Link } from "../../components/ui/link";

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
              <p>{article.data.tags.map((tag) => <><a href={`/blog/tag/${tag}`} className="underline">#{tag}</a>{" "}</>)}</p>
              <p className="text-zinc-700">
                {new Date(article.data.publish_time as Date).toLocaleDateString("cs-CZ", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {/* {localeName(article.locale) !== null
                    ? " · " + localeName(article.locale)
                    : ""} */}
              </p>
            </div>
            <Heading level="h3">{article.data.title}</Heading>
            <p className="my-4 text-zinc-700">{truncateText(article.data.description)}</p>
            <div className="mt-auto flex justify-end pt-4">
              <Link href={"/blog/" + article.id}>Přečíst si článek →</Link>
              {/* <Button href={"/blog/" + article.id} variant="primary">
                Přečíst si článek
              </Button> */}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
