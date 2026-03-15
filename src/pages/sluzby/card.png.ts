import type { APIContext } from "astro";

import { CreateServicesImageComponent } from "../../features/opengraph-images/services";
import { OpenGraphImageResponse } from "../../lib/opengraph";
import { getLocalizedCollection } from "../../lib/content";

export async function GET(context: APIContext) {
  const baseUrl = context.url.origin;
  const locale = context.locals.locale;
  const trainings = await getLocalizedCollection("training", locale, ({ data }) => !data.draft);
  const component = CreateServicesImageComponent({ trainingCount: trainings.length, locale });

  return OpenGraphImageResponse(component, baseUrl);
}
