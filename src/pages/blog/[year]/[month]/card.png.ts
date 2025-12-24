import { type CollectionEntry, getCollection } from "astro:content";

import { CreateDateArchiveImageComponent } from "../../../../features/opengraph-images/date-archive";
import { OpenGraphImageResponse } from "../../../../lib/opengraph";

const CZECH_MONTHS = [
  "Leden",
  "Únor",
  "Březen",
  "Duben",
  "Květen",
  "Červen",
  "Červenec",
  "Srpen",
  "Září",
  "Říjen",
  "Listopad",
  "Prosinec",
];

interface Props {
  year: number;
  month: number;
  monthName: string;
  articles: CollectionEntry<"blog">[];
}

export async function getStaticPaths() {
  const articles = await getCollection("blog", ({ data }) => !data.draft);
  const currentYear = new Date().getFullYear();

  // Group articles by year-month
  const yearMonthMap = new Map<string, CollectionEntry<"blog">[]>();

  for (const article of articles) {
    const date = article.data.publish_time;
    const year = date.getFullYear();

    if (year <= currentYear + 1 && year >= 2020) {
      const month = date.getMonth() + 1;
      const key = `${year}-${String(month).padStart(2, "0")}`;

      if (!yearMonthMap.has(key)) {
        yearMonthMap.set(key, []);
      }
      yearMonthMap.get(key)!.push(article);
    }
  }

  return Array.from(yearMonthMap.entries()).map(([key, monthArticles]) => {
    const [yearStr, monthStr] = key.split("-");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    return {
      params: {
        year: yearStr,
        month: monthStr,
      },
      props: {
        year,
        month,
        monthName: CZECH_MONTHS[month - 1],
        articles: monthArticles,
      },
    };
  });
}

export async function GET({
  params,
  props,
}: {
  params: { year: string; month: string };
  props: Props;
}) {
  const { year, month, monthName, articles } = props;

  const component = await CreateDateArchiveImageComponent({
    title: `${monthName} ${year}`,
    articleCount: articles.length,
    url: `mares.cz/blog/${year}/${String(month).padStart(2, "0")}`,
  });

  return OpenGraphImageResponse(component);
}
