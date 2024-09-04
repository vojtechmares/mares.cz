import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { readdir } from "fs/promises";
import { Metadata } from "next";
import Link from "next/link";

type Article = {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  lang: string;
};

async function getArticles(): Promise<Article[]> {
  const slugs = (
    await readdir("./content/articles", { withFileTypes: true })
  ).filter((dirent) => !dirent.isDirectory());

  let articles = await Promise.all(
    slugs.map(async (dirent) => {
      const { meta } = await import(`@/content/articles/${dirent.name}`);
      return { slug: dirent.name.replace(/\.mdx$/, ""), ...meta };
    }),
  );

  // remove articles that are not published yet
  articles = articles.filter(
    (article) => new Date() >= new Date(article.publishDate),
  );

  articles.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

  return articles;
}

export const metadata: Metadata = {
  title: "Blog | Vojtěch Mareš - DevOps architekt, konzultant, lektor",
  description: "Články nejen o DevOps, automatizaci a vývoji softwaru",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "https://www.mares.cz/api/blog/feed/rss.xml",
      "application/atom+xml": "https://www.mares.cz/api/blog/feed/atom.xml",
    },
  },
};

function localeName(locale: string): null | string {
  switch (locale) {
    case "cs":
      return "Česky";
    case "en":
      return "English";
    default:
      return null;
  }
}

function groupArticlesByYear(articles: Article[]): [string, Article[]][] {
  const grouped = articles.reduce(
    (acc, article) => {
      const year = new Date(article.publishDate).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(article);
      return acc;
    },
    {} as { [year: number]: Article[] },
  );

  const iterable = Object.entries(grouped);
  return iterable.sort(
    ([yearA, articlesA], [yearB, articlesB]) => +yearB - +yearA,
  );
}

export default async function Articles() {
  const articles = await getArticles();
  const groupedArticles = groupArticlesByYear(articles);

  return (
    <Container className="pb-14 sm:pb-20 lg:pb-32">
      <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
        Blog
      </h2>
      <p className="mt-4 text-base lg:text-xl">
        Odebírejte:{" "}
        <Link
          className="underline"
          type="application/rss+xml"
          href="/api/blog/feed/rss.xml"
        >
          RSS
        </Link>
        ,{" "}
        <Link
          className="underline"
          type="application/atom+xml"
          href="/api/blog/feed/atom.xml"
        >
          Atom
        </Link>
      </p>
      <div className="max-w-prose text-base md:text-lg lg:text-xl">
        {groupedArticles.map(([year, articles]) => (
          <div key={year}>
            <div className="relative mt-10">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-start">
                <span
                  role="heading"
                  aria-level={2}
                  className="bg-white pr-3 text-base font-semibold leading-6 text-black"
                >
                  {year}
                </span>
              </div>
            </div>
            {articles.map((article) => (
              <div key={article.slug}>
                <h3 className="font-display mt-10 text-3xl font-bold tracking-tight">
                  {article.title}
                </h3>
                <p className="my-4 text-slate-700">
                  {new Date(article.publishDate).toLocaleDateString("cs-CZ", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {localeName(article.lang) !== null
                    ? " | " + localeName(article.lang)
                    : ""}
                </p>
                <p className="my-4 text-slate-700">{article.description}</p>
                <Button href={"/blog/" + article.slug} color="black">
                  Přečíst si článek
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Container>
  );
}
