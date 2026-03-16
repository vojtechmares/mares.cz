import type { APIContext } from "astro";

import { CreateDateArchiveImageComponent } from "../../../../features/opengraph-images/date-archive";
import { OpenGraphImageResponse } from "../../../../lib/opengraph";
import { getLocalizedCollection } from "../../../../lib/content";

export async function GET(context: APIContext) {
  const baseUrl = context.site?.origin ?? "https://www.mares.cz";
  const locale = context.locals.locale;
  const yearParam = context.params.year;
  const year = parseInt(yearParam!);
  const currentYear = new Date().getFullYear();

  if (isNaN(year) || year < 2020 || year > currentYear + 1) {
    return new Response("Not Found", { status: 404 });
  }

  const articles = await getLocalizedCollection(
    "blog",
    locale,
    ({ data }) => !data.draft && data.publish_time.getFullYear() === year,
  );

  if (articles.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  const component = await CreateDateArchiveImageComponent({
    title: year.toString(),
    articleCount: articles.length,
    url: `mares.cz/blog/archive/${year}`,
    baseUrl,
    locale,
  });

  return OpenGraphImageResponse(component, baseUrl);
}
