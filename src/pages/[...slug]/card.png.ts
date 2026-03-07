import { getCollection, getEntry } from "astro:content";
import type { APIContext } from "astro";

import { CreatePageImageComponent } from "../../features/opengraph-images/page";
import { OpenGraphImageResponse } from "../../lib/opengraph";

export async function GET({ params, url }: APIContext) {
  const baseUrl = url.origin;
  const { slug } = params;
  if (!slug) {
    return new Response("Not Found", { status: 404 });
  }

  const page = await getEntry("page", slug);
  if (!page || page.data.draft) {
    const allPages = await getCollection("page", ({ data }) => !data.draft && data.redirectFrom?.includes(slug!));
    if (allPages.length > 0) {
      return Response.redirect(new URL(`/${allPages[0].id}/card.png`, url).toString(), 301);
    }
    return new Response("Not Found", { status: 404 });
  }

  const component = await CreatePageImageComponent({
    slug: page.id,
    title: page.data.title,
    description: page.data.description,
    baseUrl,
  });

  return OpenGraphImageResponse(component, baseUrl);
}
