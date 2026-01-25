import { getEntry } from "astro:content";
import type { APIContext } from "astro";

import { CreatePageImageComponent } from "../../features/opengraph-images/page";
import { OpenGraphImageResponse } from "../../lib/opengraph";

export async function GET({ params, site }: APIContext) {
  const { slug } = params;
  if (!slug) {
    return new Response("Not Found", { status: 404 });
  }

  const page = await getEntry("page", slug);
  if (!page || page.data.draft) {
    return new Response("Not Found", { status: 404 });
  }

  const component = await CreatePageImageComponent({
    slug: page.id,
    title: page.data.title,
    description: page.data.description,
    baseUrl: site!,
  });

  return OpenGraphImageResponse(component, site!);
}
