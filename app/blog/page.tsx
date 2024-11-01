import { strapi } from "@/lib/strapi/strapi";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

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

export default async function Articles() {
  const articles = await strapi.fetchArticles();

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
        {articles.map((article) => (
          <div key={article.slug}>
            <h3 className="font-display mt-10 text-3xl font-bold tracking-tight">
              {article.title}
            </h3>
            <p className="my-4 text-slate-700">
              {new Date(article.publishedAt).toLocaleDateString("cs-CZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {localeName(article.locale) !== null
                ? " · " + localeName(article.locale)
                : ""}
            </p>
            <p className="my-4 text-slate-700">{article.description}</p>
            <Button href={"/blog/" + article.slug} color="black">
              Přečíst si článek
            </Button>
          </div>
        ))}
      </div>
    </Container>
  );
}
