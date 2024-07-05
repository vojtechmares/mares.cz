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
  const slugs = await getTrainingSlugs();

  const trainingURLs = slugs.map((slug) => ({
    url: `https://vojtechmares.com/skoleni/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const baseURLs = [
    {
      url: "https://vojtechmares.com",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: "https://acme.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: "https://vojtechmares.com/clanky",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: "https://vojtechmares.com/prednasky",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return [...baseURLs, ...trainingURLs];
}
