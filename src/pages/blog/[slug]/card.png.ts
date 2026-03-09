import { getCollection, getEntry } from "astro:content";
import type { APIContext } from "astro";

import { CreateArticleImageComponent } from "../../../features/opengraph-images/article";
import { OpenGraphImageResponse } from "../../../lib/opengraph";

export async function GET({ params, url }: APIContext) {
  const baseUrl = url.origin;
  const article = await getEntry("blog", params.slug!);
  if (!article || article.data.draft) {
    const allPosts = await getCollection(
      "blog",
      ({ data }) => !data.draft && data.redirectFrom?.includes(params.slug!),
    );
    if (allPosts.length > 0) {
      return Response.redirect(new URL(`/blog/${allPosts[0].id}/card.png`, url).toString(), 301);
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
  });

  return OpenGraphImageResponse(component, baseUrl);
}
