import type { APIContext } from "astro";

import { CreateHomepageImageComponent } from "../features/opengraph-images/homepage";
import { OpenGraphImageResponse } from "../lib/opengraph";

export async function GET({ site }: APIContext) {
  const component = await CreateHomepageImageComponent(site!);

  return OpenGraphImageResponse(component, site!);
}
