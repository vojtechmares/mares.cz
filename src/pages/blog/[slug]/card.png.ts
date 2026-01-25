import { getEntry } from "astro:content";
import type { APIContext } from "astro";

import { CreateArticleImageComponent } from "../../../features/opengraph-images/article";
import { OpenGraphImageResponse } from "../../../lib/opengraph";

export async function GET({ params, site }: APIContext) {
  const article = await getEntry("blog", params.slug!);
  if (!article || article.data.draft) {
    return new Response("Not Found", { status: 404 });
  }

  const component = await CreateArticleImageComponent({
    slug: article.id,
    title: article.data.title,
    description: article.data.description,
    baseUrl: site!,
  });

  return OpenGraphImageResponse(component, site!);
}
