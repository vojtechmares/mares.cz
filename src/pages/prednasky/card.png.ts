import type { APIContext } from "astro";

import { CreatePrednaskyImageComponent } from "../../features/opengraph-images/prednasky";
import { OpenGraphImageResponse } from "../../lib/opengraph";

export async function GET({ site }: APIContext) {
  const component = await CreatePrednaskyImageComponent(site!);
  return OpenGraphImageResponse(component, site!);
}
