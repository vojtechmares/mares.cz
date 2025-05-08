import {strapi} from "@/lib/strapi/strapi"
import {MetadataRoute} from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await strapi.fetchArticles({limit: 100})
  const pages = await strapi.fetchPages()
  const trainings = await strapi.fetchTrainings()

  const trainingURLs = trainings.map((training) => ({
    url: `https://www.mares.cz/skoleni/${training.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const blogArticleURLs = articles.map((article) => ({
    url: `https://www.mares.cz/blog/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const pageURLs = pages.map((page) => ({
    url: `https://www.mares.cz/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  const baseURLs = [
    {
      url: "https://www.mares.cz",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: "https://www.mares.cz/blog",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: "https://www.mares.cz/skoleni/verejne-terminy",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ]

  return [...baseURLs, ...trainingURLs, ...pageURLs, ...blogArticleURLs]
}
