import { strapi } from "@/lib/strapi/strapi";
import { readdir } from "fs/promises";
import { MetadataRoute } from "next";

async function getTrainingSlugs() {
  let files = (
    await readdir("./content/trainings", { withFileTypes: true })
  ).filter((dirent) => !dirent.isDirectory());

  let slugs: string[] = [];
  for (let i = 0; i < files.length; i++) {
    slugs.push(files[i].name.replace(/\.mdx$/, "") as string);
  }

  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const trainingSlugs = await getTrainingSlugs();
  const articles = await strapi.fetchArticles({ limit: 100 });
  const pages = await strapi.fetchPages();

  const trainingURLs = trainingSlugs.map((slug) => ({
    url: `https://www.mares.cz/skoleni/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogArticleURLs = articles.map((article) => ({
    url: `https://www.mares.cz/blog/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const pageURLs = pages.map((page) => ({
    url: `https://www.mares.cz/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

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
  ];

  return [...baseURLs, ...trainingURLs, ...pageURLs, ...blogArticleURLs];
}
