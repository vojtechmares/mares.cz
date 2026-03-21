import type { APIContext } from "astro";

import { CreateBlogListingImageComponent } from "../../features/opengraph-images/blog-listing";
import { OpenGraphImageResponse } from "../../lib/opengraph";
import { getLocalizedCollection } from "../../lib/content";

export async function GET(context: APIContext) {
  const baseUrl = context.site?.origin ?? "https://www.mares.cz";
  const locale = context.locals.locale;

  const articles = await getLocalizedCollection("blog", locale, ({ data }) => !data.draft);
  const articleCount = articles.length;

  const tags = new Set<string>();
  for (const article of articles) {
    for (const tag of article.data.tags) {
      tags.add(tag);
    }
  }
  const tagCount = tags.size;

  const component = CreateBlogListingImageComponent({ articleCount, tagCount, locale });
  return OpenGraphImageResponse(component, baseUrl);
}
