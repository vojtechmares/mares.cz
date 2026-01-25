import { getCollection } from "astro:content";
import type { APIContext } from "astro";

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

export async function GET({ params, site }: APIContext) {
  const year = parseInt(params.year!);
  const month = parseInt(params.month!);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return new Response("Not Found", { status: 404 });
  }

  const articles = await getCollection(
    "blog",
    ({ data }) => !data.draft && data.publish_time.getFullYear() === year && data.publish_time.getMonth() + 1 === month,
  );

  if (articles.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  const monthName = CZECH_MONTHS[month - 1];

  const component = await CreateDateArchiveImageComponent({
    title: `${monthName} ${year}`,
    articleCount: articles.length,
    url: `mares.cz/blog/${year}/${String(month).padStart(2, "0")}`,
    baseUrl: site!,
  });

  return OpenGraphImageResponse(component, site!);
}
