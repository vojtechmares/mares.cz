import {v5 as uuidV5} from "uuid"
import {strapi} from "@/lib/strapi/strapi"

// cache for 1 hour
export const revalidate = 3600

export async function GET() {
  const articles = await strapi.fetchArticles({limit: 100})

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
${articles
  .map(
    (a) => `  <entry>
    <title>${a.title}</title>
    <link href="https://www.mares.cz/blog/${a.slug}" />
    <id>urn:uuid:${uuidV5(a.slug, "7a69009f-684a-4485-b672-fa97b6d07741")}</id>
    <published>${a.publishedAt.toISOString()}</published>
    <summary>${a.description}</summary>
  </entry>
`,
  )
  .join("")}</feed>`

  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
}
