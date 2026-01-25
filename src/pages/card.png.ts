import type { APIContext } from "astro";

import { CreateHomepageImageComponent } from "../features/opengraph-images/homepage";
import { OpenGraphImageResponse } from "../lib/opengraph";

export async function GET({ url }: APIContext) {
  const baseUrl = url.origin;
  const component = await CreateHomepageImageComponent(baseUrl);

  return OpenGraphImageResponse(component, baseUrl);
}
