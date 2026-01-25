import type { Loader, LoaderContext } from "astro/loaders";
import { BackofficeClient, type APISession } from "../backoffice";

interface SessionLoaderConfig {
  apiUrl: string;
  oidcIssuer: string;
  clientId: string;
  clientSecret: string;
  oidcAudience?: string;
}

export function sessionLoader(config: SessionLoaderConfig): Loader {
  return {
    name: "session-loader",
    load: async (context: LoaderContext) => {
      const { store, logger, parseData, generateDigest } = context;

      const client = new BackofficeClient(config.apiUrl, {
        issuer: config.oidcIssuer,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        audience: config.oidcAudience,
      });

      logger.info("Fetching sessions from backoffice API...");

      const sessions = await client.getSessions({
        limit: 24,
        sort: "date",
        order: "asc",
        status: ["SCHEDULED", "CONFIRMED"],
      });

      logger.info(`Received ${sessions.length} sessions`);

      store.clear();

      for (const session of sessions) {
        const id = generateSessionId(session);
        const data = transformSession(session);
        const parsedData = await parseData({ id, data });

        store.set({
          id,
          data: parsedData,
          digest: generateDigest(data),
        });
      }

      logger.info(`Loaded ${sessions.length} sessions into content collection`);
    },
  };
}

function generateSessionId(session: APISession): string {
  const slug = session.training_name.toLowerCase().replace(/\s+/g, "-");
  const date = session.date.split("T")[0];
  return `${slug}-${date}`;
}

function transformSession(session: APISession) {
  const startDate = session.date.split("T")[0];
  return {
    trainingID: session.training_id,
    name: session.training_name,
    dates: {
      start: startDate,
      ...(session.length > 1 && {
        end: calculateEndDate(startDate, session.length),
      }),
    },
    location: session.location,
    price: session.pricing_amount,
    ...(session.signup_url && { signUpURL: session.signup_url }),
  };
}

function calculateEndDate(startDate: string, lengthDays: number): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + lengthDays - 1);
  return date.toISOString().split("T")[0];
}
