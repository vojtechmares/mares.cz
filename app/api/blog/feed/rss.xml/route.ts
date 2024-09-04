import { readdir } from "fs/promises";

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

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Blog | Vojtěch Mareš - DevOps architekt, konzultant, lektor</title>
    <link>https://www.mares.cz/blog</link>
    <description>Články nejen o DevOps, automatizaci a vývoji softwaru.</description>
    <language>cs-cz</language>${pastArticles
      .map(
        (a) => `
    <item>
      <title>${a.title}</title>
      <link>https://www.mares.cz/blog/${a.slug}</link>
      <description>${a.description}</description>
      <pubDate>${new Date(a.publishDate).toISOString()}</pubDate>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
