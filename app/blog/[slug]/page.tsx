import { readdir } from "fs/promises";
import { type MDXContent } from "mdx/types";
import { Metadata, ResolvingMetadata } from "next";
import "@/styles/highlight-js/github-dark.css";
import { Container } from "@/components/Container";
import { TrainingAd } from "@/components/blog/TrainingAd";
// import "@/styles/highlight-js/googlecode.css";
// import "@/styles/highlight-js/tokyo-night-dark.css";

export async function generateStaticParams() {
  let files = (
    await readdir("./content/articles", { withFileTypes: true })
  ).filter((dirent) => !dirent.isDirectory());

  let slugs: { slug: string }[] = [];
  for (let i = 0; i < files.length; i++) {
    slugs.push({ slug: files[i].name.replace(/\.mdx$/, "") });
  }

  return slugs;
}

async function getArticle(params: { slug: string }) {
  const { default: content, meta }: { default: MDXContent; meta: any } =
    await import(`@/content/articles/${params.slug}.mdx`);
  return { content, meta };
}

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { meta } = await getArticle(params);

  return {
    title:
      "Z blogu: " +
      meta.title +
      " | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: "/blog/" + params.slug,
    },
    openGraph: {
      url: "https://www.mares.cz/blog/" + params.slug,
      type: "article",
      siteName:
        "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
      title:
        "Z blogu: " +
        meta.title +
        " | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
      description: meta.description,
    },
    twitter: {
      card: "summary_large_image",
      site: "@vojtechmares_",
      creator: "@vojtechmares_",
      title:
        "Z blogu: " +
        meta.title +
        " | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
      description: meta.description,
    },
  };
}

export default async function Article({ params }: Props) {
  const { content: Content, meta } = await getArticle(params);

  return (
    <>
      <Container>
        <article className="prose:text-black prose-h1:font-display prose-h2:font-display prose-h3:font-display prose pb-14 md:prose-lg lg:prose-xl prose-h1:text-3xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h3:text-xl prose-h3:font-medium prose-p:text-slate-700 prose-ol:ps-5 prose-ul:ps-5 prose-li:my-0 sm:pb-20 prose-h1:sm:text-4xl prose-h2:sm:text-3xl prose-h1:md:text-5xl prose-ol:md:ps-6 prose-ul:md:ps-6 lg:pb-32">
          <Content />
        </article>
      </Container>
      {meta.trainingAd !== undefined ? (
        <TrainingAd trainingSlug={meta.trainingAd} />
      ) : (
        <></>
      )}
    </>
  );
}
