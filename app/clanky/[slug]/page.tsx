import { readdir } from "fs/promises";
import { type MDXContent } from "mdx/types";

export async function generateStaticParams() {
  let files = (
    await readdir("./content/articles", { withFileTypes: true })
  ).filter((dirent) => !dirent.isDirectory());

  // cleanup the slugs from file extension
  files.forEach((dirent) => dirent.name.replace(/\.mdx$/, ""));

  let slugs: { slug: string }[] = [];
  for (let i = 0; i < files.length; i++) {
    slugs.push({ slug: files[i].name });
  }

  return slugs;
}

async function getArticle(params: { slug: string }) {
  const { default: content, meta }: { default: MDXContent; meta: any } =
    await import(`@/content/articles/${params.slug}.mdx`);
  return { content, meta };
}

export default async function Article({ params }: { params: { slug: string } }) {
  const { content: Content, meta } = await getArticle(params);

  return <Content />;
}
