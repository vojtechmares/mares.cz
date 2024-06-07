import { Container } from "@/components/Container";
import { readdir } from "fs/promises";
import Link from "next/link";

async function getArticles() {
  const slugs = (
    await readdir("./app/clanky/(clanky)", { withFileTypes: true })
  ).filter((dirent) => dirent.isDirectory());

  let articles = await Promise.all(
    slugs.map(async (dirent) => {
      const { metadata } = await import(`./(clanky)/${dirent.name}/page.mdx`);
      return { slug: dirent.name, ...metadata };
    }),
  );

  // remove articles that are not published yet
  articles = articles.filter(
    (article) => new Date() >= new Date(article.publishDate),
  );

  articles.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

  return articles;
}

export default async function Articles() {
  const articles = await getArticles();

  return (
    <Container className="pb-14 sm:pb-20 lg:pb-32">
      <h2 className="font-display mb-8 text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
        Články
      </h2>
      <div className="grid max-w-prose grid-cols-1 space-y-4 divide-dashed">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={"/clanky/" + article.slug}
            className="rounded-2xl bg-slate-50 px-8 py-6"
          >
            <h3 className="font-display text-3xl font-bold tracking-tight">
              {article.title}
            </h3>
            <p className="text-md">
              {new Date(article.publishDate).toLocaleDateString("cs-CZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="mt-4 text-xl">{article.description}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
