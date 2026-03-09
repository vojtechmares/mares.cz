import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { CreateServicesImageComponent } from "../../features/opengraph-images/services";
import { OpenGraphImageResponse } from "../../lib/opengraph";

export async function GET({ url }: APIContext) {
  const baseUrl = url.origin;
  const trainings = await getCollection("training");
  const component = CreateServicesImageComponent({ trainingCount: trainings.length });

  return OpenGraphImageResponse(component, baseUrl);
}
