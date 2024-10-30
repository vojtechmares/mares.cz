import { Metadata } from "next";
import { strapi } from "@/lib/strapi/strapi";
import "@/styles/highlight-js/github-dark.css";
import { TrainingAd } from "@/components/blog/TrainingAd";
import { ArticleHeader } from "@/components/blog/article-header";
import { Article } from "@/components/blog/article";
import { notFound } from "next/navigation";

// Next.js will invalidate the cache when a
// request comes in, at most once every hour.
export const revalidate = 3600;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const articles = await strapi.fetchArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await strapi.getArticle(slug);

  return {
    title:
      "Z blogu: " +
      article.title +
      " | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: "/blog/" + slug,
    },
    openGraph: {
      url: "https://www.mares.cz/blog/" + slug,
      type: "article",
      siteName:
        "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
      title:
        "Z blogu: " +
        article.title +
        " | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
      description: article.description,
    },
    twitter: {
      card: "summary_large_image",
      site: "@vojtechmares_",
      creator: "@vojtechmares_",
      title:
        "Z blogu: " +
        article.title +
        " | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
      description: article.description,
    },
  };
}

export default async function ArticlePage(props: { params: Params }) {
  const { slug } = await props.params;

  try {
    const article = await strapi.getArticle(slug);

    return (
      <>
        <ArticleHeader article={article} />
        <Article article={article} />
        {article.trainingAd !== undefined ? (
          <TrainingAd trainingSlug={article.trainingAd} />
        ) : (
          <></>
        )}
      </>
    );
  } catch (error) {
    notFound();
  }
}
