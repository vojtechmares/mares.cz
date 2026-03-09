import { getCollection, getEntry } from "astro:content";
import type { APIContext } from "astro";

import { CreateTrainingImageComponent } from "../../../features/opengraph-images/training";
import { imageToDataUrl, OpenGraphImageResponse } from "../../../lib/opengraph";

export async function GET({ params, url }: APIContext) {
  const baseUrl = url.origin;
  const training = await getEntry("training", params.slug!);
  if (!training || training.data.draft) {
    const allTrainings = await getCollection(
      "training",
      ({ data }) => !data.draft && data.redirectFrom?.includes(params.slug!),
    );
    if (allTrainings.length > 0) {
      return Response.redirect(new URL(`/skoleni/${allTrainings[0].id}/card.png`, url).toString(), 301);
    }
    return new Response("Not Found", { status: 404 });
  }

  let iconDataUrl: string | undefined = undefined;
  if (training.data.icon?.src !== undefined) {
    iconDataUrl = await imageToDataUrl(training.data.icon.src, baseUrl);
  }

  const pricing = training.data.price.open.filter((variant) => variant.currency === "CZK")[0].amount;

  const component = CreateTrainingImageComponent({
    slug: training.id,
    title: training.data.title,
    description: training.data.description,
    length: training.data.length,
    price: pricing,
    image: iconDataUrl,
  });

  return OpenGraphImageResponse(component, baseUrl);
}
