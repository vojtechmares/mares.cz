import {strapi} from "@/lib/strapi/strapi"
import {MetadataRoute} from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = "https://www.mares.cz"

  const articles = await strapi.fetchArticles({limit: 100})
  const pages = await strapi.fetchPages()
  const trainings = await strapi.fetchTrainings()

  const trainingURLs = trainings.map((training) => ({
    url: `${baseURL}/skoleni/${training.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const blogArticleURLs = articles.map((article) => ({
    url: `${baseURL}/blog/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const pageURLs = pages.map((page) => ({
    url: `${baseURL}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  const staticURLs = [
    {
      url: baseURL,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: `${baseURL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${baseURL}/skoleni/verejne-terminy`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ]

  return [...staticURLs, ...trainingURLs, ...pageURLs, ...blogArticleURLs]
}
