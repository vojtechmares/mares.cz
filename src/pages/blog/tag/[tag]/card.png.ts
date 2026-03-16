import type { APIContext } from "astro";

import { CreateTagArchiveImageComponent } from "../../../../features/opengraph-images/tag-archive";
import { OpenGraphImageResponse } from "../../../../lib/opengraph";
import { getLocalizedCollection } from "../../../../lib/content";

export async function GET(context: APIContext) {
  const baseUrl = context.site?.origin ?? "https://www.mares.cz";
  const locale = context.locals.locale;
  const { tag } = context.params;
  if (!tag) {
    return new Response("Not Found", { status: 404 });
  }

  const articles = await getLocalizedCollection("blog", locale, ({ data }) => !data.draft && data.tags.includes(tag));

  if (articles.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  const component = await CreateTagArchiveImageComponent({
    tag,
    articleCount: articles.length,
    baseUrl,
    locale,
  });

  return OpenGraphImageResponse(component, baseUrl);
}
