import { Metadata } from "next";
import { strapi } from "@/lib/strapi/strapi";
import "@/styles/highlight-js/github-dark.css";
import { TrainingAd } from "@/components/blog/TrainingAd";
import { ArticleHeader } from "@/components/blog/article-header";
import { Article } from "@/components/blog/article";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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
