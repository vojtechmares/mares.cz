import { readdir } from "fs/promises";
import { v5 as uuidv5 } from "uuid";

type Article = {
  slug: string;
  title: string;
  description: string;
  publishDate: Date;
  lang: string;
};

// cache for 4 hours
export const revalidate = 14400;

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

export async function GET() {
  const today = new Date();

  const allArticles: Article[] = await getArticles();

  const pastArticles = allArticles.filter((a) => {
    return new Date(a.publishDate) < today;
  });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Blog | Vojtěch Mareš - DevOps architekt, konzultant, lektor</title>
  <link href="https://www.mares.cz/blog"/>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>Vojtěch Mareš</name>
    <email>vojtech@mares.cz</email>
    <uri>https://www.mares.cz/</uri>
  </author>
  <id>urn:uuid:7a69009f-684a-4485-b672-fa97b6d07741</id>
${pastArticles
  .map(
    (a) => `  <entry>
    <title>${a.title}</title>
    <link href="https://www.mares.cz/blog/${a.slug}" />
    <id>urn:uuid:${uuidv5(a.slug, "7a69009f-684a-4485-b672-fa97b6d07741")}</id>
    <published>${new Date(a.publishDate).toISOString()}</published>
    <summary>${a.description}</summary>
  </entry>
`,
  )
  .join("")}</feed>`;

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
