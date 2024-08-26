import { readdir } from "fs/promises";
import { type MDXContent } from "mdx/types";
import { Metadata, ResolvingMetadata } from "next";
import "@/styles/highlight-js/github-dark.css";
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
    title: meta.title,
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
      title: meta.title,
      description: meta.description,
    },
    twitter: {
      card: "summary_large_image",
      site: "@vojtechmares_",
      creator: "@vojtechmares_",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function Article({ params }: Props) {
  const { content: Content, meta } = await getArticle(params);

  return <Content />;
}
