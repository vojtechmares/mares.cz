import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { CreatePrednaskyImageComponent } from "../../features/opengraph-images/prednasky";
import { OpenGraphImageResponse } from "../../lib/opengraph";

export async function GET(context: APIContext) {
  const baseUrl = context.url.origin;
  const locale = context.locals.locale;

  const talks = await getCollection("talk", ({ data }) => !data.draft);
  const talkCount = talks.length;
  const eventCount = new Set(talks.map((t) => t.data.event.name)).size;
  const yearsOfSpeaking = new Date().getFullYear() - Math.min(...talks.map((t) => t.data.date.getFullYear()));

  const component = CreatePrednaskyImageComponent({ talkCount, eventCount, yearsOfSpeaking, locale });
  return OpenGraphImageResponse(component, baseUrl);
}
