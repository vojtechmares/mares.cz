import { getCollection } from "astro:content";
import type { APIContext } from "astro";

import { CreateDateArchiveImageComponent } from "../../../features/opengraph-images/date-archive";
import { OpenGraphImageResponse } from "../../../lib/opengraph";

export async function GET({ params }: APIContext) {
  const yearParam = params.year;
  const year = parseInt(yearParam!);
  const currentYear = new Date().getFullYear();

  if (isNaN(year) || year < 2020 || year > currentYear + 1) {
    return new Response("Not Found", { status: 404 });
  }

  const articles = await getCollection("blog", ({ data }) => !data.draft && data.publish_time.getFullYear() === year);

  if (articles.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  const component = await CreateDateArchiveImageComponent({
    title: year.toString(),
    articleCount: articles.length,
    url: `mares.cz/blog/${year}`,
  });

  return OpenGraphImageResponse(component);
}
