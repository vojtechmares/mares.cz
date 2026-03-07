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

  const component = await CreateArticleImageComponent({
    slug: article.id,
    title: article.data.title,
    description: article.data.description,
    baseUrl,
  });

  return OpenGraphImageResponse(component, baseUrl);
}
