import { getCollection, getEntry } from "astro:content";
import type { APIContext } from "astro";

import { CreateTrainingImageComponent } from "../../../features/opengraph-images/training";
import { imageToDataUrl, OpenGraphImageResponse } from "../../../lib/opengraph";

export async function GET(context: APIContext) {
  const baseUrl = context.url.origin;
  const locale = context.locals.locale;
  const training = await getEntry("training", context.params.slug!);
  if (!training || training.data.draft) {
    const allTrainings = await getCollection(
      "training",
      ({ data }) => !data.draft && data.redirectFrom?.includes(context.params.slug!),
    );
    if (allTrainings.length > 0) {
      return Response.redirect(new URL(`/skoleni/${allTrainings[0].id}/card.png`, context.url).toString(), 301);
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
    locale,
  });

  return OpenGraphImageResponse(component, baseUrl);
}
