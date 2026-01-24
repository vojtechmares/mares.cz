import { type CollectionEntry, getCollection } from "astro:content";

import { CreateDateArchiveImageComponent } from "../../../features/opengraph-images/date-archive";
import { OpenGraphImageResponse } from "../../../lib/opengraph";

interface Props {
  year: number;
  articles: CollectionEntry<"blog">[];
}

export async function getStaticPaths() {
  const articles = await getCollection("blog", ({ data }) => !data.draft);
  const currentYear = new Date().getFullYear();

  // Extract valid years
  const yearMap = new Map<number, CollectionEntry<"blog">[]>();

  for (const article of articles) {
    const year = article.data.publish_time.getFullYear();
    if (year <= currentYear + 1 && year >= 2020) {
      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }
      yearMap.get(year)!.push(article);
    }
  }

  return Array.from(yearMap.entries()).map(([year, yearArticles]) => ({
    params: { year: year.toString() },
    props: {
      year,
      articles: yearArticles,
    },
  }));
}

export async function GET({ props }: { params: { year: string }; props: Props }) {
  const { year } = props;
  const { articles } = props;

  const component = await CreateDateArchiveImageComponent({
    title: year.toString(),
    articleCount: articles.length,
    url: `mares.cz/blog/${year}`,
  });

  return OpenGraphImageResponse(component);
}
