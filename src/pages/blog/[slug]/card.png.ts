import type { APIContext } from "astro";

import { CreateArticleImageComponent } from "../../../features/opengraph-images/article";
import { OpenGraphImageResponse } from "../../../lib/opengraph";
import { getLocalizedEntry, getLocalizedCollection, bareSlug } from "../../../lib/content";
import { localizeUrl } from "../../../i18n/routes";

export async function GET(context: APIContext) {
  const baseUrl = context.site?.origin ?? "https://www.mares.cz";
  const locale = context.locals.locale;
  const article = await getLocalizedEntry("blog", context.params.slug!, locale);
  if (!article || article.data.draft) {
    const allPosts = await getLocalizedCollection(
      "blog",
      locale,
      ({ data }) => !data.draft && data.redirectFrom?.includes(context.params.slug!),
    );
    if (allPosts.length > 0) {
      return Response.redirect(
        new URL(localizeUrl(`/blog/${bareSlug(allPosts[0].id)}/card.png`, locale), context.url).toString(),
        301,
      );
    }
    return new Response("Not Found", { status: 404 });
  }

  const words = article.body?.split(/\s+/).length ?? 0;
  const readingTimeMinutes = Math.max(1, Math.round(words / 200));

  const component = CreateArticleImageComponent({
    slug: article.id,
    title: article.data.title,
    description: article.data.description,
    publishDate: article.data.publish_time,
    tags: article.data.tags,
    readingTimeMinutes,
    locale,
  });

  return OpenGraphImageResponse(component, baseUrl);
}
