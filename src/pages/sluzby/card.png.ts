import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { CreateServicesImageComponent } from "../../features/opengraph-images/services";
import { OpenGraphImageResponse } from "../../lib/opengraph";

export async function GET(context: APIContext) {
  const baseUrl = context.url.origin;
  const locale = context.locals.locale;
  const trainings = await getCollection("training");
  const component = CreateServicesImageComponent({ trainingCount: trainings.length, locale });

  return OpenGraphImageResponse(component, baseUrl);
}
