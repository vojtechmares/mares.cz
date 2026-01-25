import type { APIContext } from "astro";

import { CreatePrednaskyImageComponent } from "../../features/opengraph-images/prednasky";
import { OpenGraphImageResponse } from "../../lib/opengraph";

export async function GET({ url }: APIContext) {
  const baseUrl = url.origin;
  const component = await CreatePrednaskyImageComponent(baseUrl);
  return OpenGraphImageResponse(component, baseUrl);
}
