import type { APIContext } from "astro";

import { CreatePageImageComponent } from "../../features/opengraph-images/page";
import { OpenGraphImageResponse } from "../../lib/opengraph";

export async function GET({ url }: APIContext) {
  const baseUrl = url.origin;
  const component = await CreatePageImageComponent({
    slug: "sluzby",
    title: "Služby",
    description:
      "Freelance DevOps a Platform architekt. Nabízím konzultace, školení a dlouhodobou spolupráci v oblasti cloudové infrastruktury.",
    baseUrl,
  });

  return OpenGraphImageResponse(component, baseUrl);
}
