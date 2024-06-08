import { readdir } from "fs/promises";
import { type MDXContent } from "mdx/types";
import { Metadata, ResolvingMetadata } from "next";

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
  };
}

export default async function Article({ params }: Props) {
  const { content: Content, meta } = await getArticle(params);

  return <Content />;
}
