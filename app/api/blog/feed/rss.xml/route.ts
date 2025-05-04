import {strapi} from "@/lib/strapi/strapi"

// cache for 1 hour
export const revalidate = 3600

export async function GET() {
  const articles = await strapi.fetchArticles({limit: 100})

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Blog | Vojtěch Mareš - DevOps architekt, konzultant, lektor</title>
    <link>https://www.mares.cz/blog</link>
    <description>Články nejen o DevOps, automatizaci a vývoji softwaru.</description>
    <language>cs-cz</language>${articles
      .map(
        (a) => `
    <item>
      <title>${a.title}</title>
      <link>https://www.mares.cz/blog/${a.slug}</link>
      <description>${a.description}</description>
      <pubDate>${a.publishedAt.toISOString()}</pubDate>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
}
