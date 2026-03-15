import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { CreateSessionsImageComponent } from "../../../features/opengraph-images/sessions";
import { OpenGraphImageResponse } from "../../../lib/opengraph";
import { getFutureSessions, toTrainingSession } from "../../../lib/sessions";

export async function GET(context: APIContext) {
  const baseUrl = context.url.origin;
  const locale = context.locals.locale;

  const [sessionEntries, trainings] = await Promise.all([
    getFutureSessions(),
    getCollection("training", ({ data }) => !data.draft),
  ]);
  const sessions = sessionEntries.map(toTrainingSession);

  const sessionCount = sessions.length;
  const topicCount = trainings.length;
  const nextSessionDate = sessions.length > 0 ? new Date(sessions[0].dates.start).toISOString() : null;

  const component = CreateSessionsImageComponent({ sessionCount, topicCount, nextSessionDate, locale });
  return OpenGraphImageResponse(component, baseUrl);
}
