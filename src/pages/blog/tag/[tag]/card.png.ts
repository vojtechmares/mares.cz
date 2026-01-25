import { getCollection } from "astro:content";
import type { APIContext } from "astro";

import { CreateTagArchiveImageComponent } from "../../../../features/opengraph-images/tag-archive";
import { OpenGraphImageResponse } from "../../../../lib/opengraph";

export async function GET({ params }: APIContext) {
  const { tag } = params;
  if (!tag) {
    return new Response("Not Found", { status: 404 });
  }

  const articles = await getCollection("blog", ({ data }) => !data.draft && data.tags.includes(tag));

  if (articles.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  const component = await CreateTagArchiveImageComponent({
    tag,
    articleCount: articles.length,
  });

  return OpenGraphImageResponse(component);
}
