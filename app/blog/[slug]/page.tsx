import { Metadata } from "next";
import { strapi } from "@/lib/strapi/strapi";
import { markdownToHtml } from "@/lib/markdown-to-html";
import "@/styles/highlight-js/github-dark.css";
import { Container } from "@/components/Container";
import { TrainingAd } from "@/components/blog/TrainingAd";

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

export default async function Article(props: { params: Params }) {
  const { slug } = await props.params;
  const article = await strapi.getArticle(slug);

  const content = await markdownToHtml(article.text);

  return (
    <>
      <Container>
        <article className="prose:text-black prose-h1:font-display prose-h2:font-display prose-h3:font-display prose pb-14 md:prose-lg lg:prose-xl prose-h1:text-3xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h3:text-xl prose-h3:font-medium prose-p:text-slate-700 prose-pre:text-xl prose-pre:leading-none prose-ol:ps-5 prose-ul:ps-5 prose-li:my-0 sm:pb-20 prose-h1:sm:text-4xl prose-h2:sm:text-3xl prose-h1:md:text-5xl prose-ol:md:ps-6 prose-ul:md:ps-6 lg:pb-32">
          <p>
            {new Date(article.publishedAt).toLocaleDateString("cs-CZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </Container>
      {article.trainingAd !== undefined ? (
        <TrainingAd trainingSlug={article.trainingAd} />
      ) : (
        <></>
      )}
    </>
  );
}
