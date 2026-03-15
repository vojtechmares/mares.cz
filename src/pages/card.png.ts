import type { APIContext } from "astro";

import { CreateHomepageImageComponent } from "../features/opengraph-images/homepage";
import { OpenGraphImageResponse } from "../lib/opengraph";

export async function GET(context: APIContext) {
  const baseUrl = context.url.origin;
  const locale = context.locals.locale;
  const component = await CreateHomepageImageComponent(baseUrl, locale);

  return OpenGraphImageResponse(component, baseUrl);
}
