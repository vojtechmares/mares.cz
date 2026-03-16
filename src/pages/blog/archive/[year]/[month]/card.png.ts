import type { APIContext } from "astro";

import { CreateDateArchiveImageComponent } from "../../../../../features/opengraph-images/date-archive";
import { OpenGraphImageResponse } from "../../../../../lib/opengraph";
import { getMonthName } from "../../../../../i18n/formatting";
import { getLocalizedCollection } from "../../../../../lib/content";

export async function GET(context: APIContext) {
  const baseUrl = context.site?.origin ?? "https://www.mares.cz";
  const locale = context.locals.locale;
  const year = parseInt(context.params.year!);
  const month = parseInt(context.params.month!);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return new Response("Not Found", { status: 404 });
  }

  const articles = await getLocalizedCollection(
    "blog",
    locale,
    ({ data }) => !data.draft && data.publish_time.getFullYear() === year && data.publish_time.getMonth() + 1 === month,
  );

  if (articles.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  const monthName = getMonthName(month, locale);

  const component = await CreateDateArchiveImageComponent({
    title: `${monthName} ${year}`,
    articleCount: articles.length,
    url: `mares.cz/blog/archive/${year}/${String(month).padStart(2, "0")}`,
    baseUrl,
    locale,
  });

  return OpenGraphImageResponse(component, baseUrl);
}
