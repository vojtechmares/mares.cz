import type {MetadataRoute} from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // disallow: "/private/",
      disallow: [
        "/api/blog/feed/rss.xml",
        "/api/blog/feed/atom.xml",
        "/cdn-cgi/l/email-protection",
      ],
    },
    sitemap: "https://www.mares.cz/sitemap.xml",
  }
}
