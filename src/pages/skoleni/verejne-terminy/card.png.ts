import type { APIContext } from "astro";

import { CreateSessionsImageComponent } from "../../../features/opengraph-images/sessions";
import { OpenGraphImageResponse } from "../../../lib/opengraph";
import { getFutureSessions, toTrainingSession } from "../../../lib/sessions";
import { getLocalizedCollection } from "../../../lib/content";

export async function GET(context: APIContext) {
  const baseUrl = context.site?.origin ?? "https://www.mares.cz";
  const locale = context.locals.locale;

  const [sessionEntries, trainings] = await Promise.all([
    getFutureSessions(),
    getLocalizedCollection("training", locale, ({ data }) => !data.draft),
  ]);
  const sessions = sessionEntries.map(toTrainingSession);

  const sessionCount = sessions.length;
  const topicCount = trainings.length;
  const nextSessionDate = sessions.length > 0 ? new Date(sessions[0].dates.start).toISOString() : null;

  const component = CreateSessionsImageComponent({ sessionCount, topicCount, nextSessionDate, locale });
  return OpenGraphImageResponse(component, baseUrl);
}
