import { getEntry } from "astro:content";
import { join } from "node:path";
import type { APIContext } from "astro";

import { CreateTrainingImageComponent } from "../../../features/opengraph-images/training";
import { imageToDataUrl, OpenGraphImageResponse } from "../../../lib/opengraph";

export async function GET({ params }: APIContext) {
  const training = await getEntry("training", params.slug!);
  if (!training || training.data.draft) {
    return new Response("Not Found", { status: 404 });
  }

  let iconDataUrl: string | undefined = undefined;
  if (training.data.icon?.src !== undefined) {
    iconDataUrl = await imageToDataUrl(join(process.cwd(), "./public", training.data.icon.src));
  }

  const component = CreateTrainingImageComponent({
    slug: training.id,
    title: training.data.title,
    description: training.data.description,
    image: iconDataUrl,
  });

  return OpenGraphImageResponse(component);
}
