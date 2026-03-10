import type { LiveLoader } from "astro/loaders";
import { BackofficeClient, type APISession } from "../backoffice";

interface SessionLoaderConfig {
  apiUrl: string;
  oidcIssuer: string;
  clientId: string;
  clientSecret: string;
  oidcAudience?: string;
}

export function sessionLoader(config: SessionLoaderConfig): LiveLoader {
  const fetchSessions = async () => {
    const client = new BackofficeClient(config.apiUrl, {
      issuer: config.oidcIssuer,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      audience: config.oidcAudience,
    });

    const sessions = await client.getSessions({
      limit: 24,
      sort: "date",
      order: "asc",
      status: ["SCHEDULED", "CONFIRMED"],
    });

    return sessions.map((session) => ({
      id: generateSessionId(session),
      data: transformSession(session),
    }));
  };

  return {
    name: "session-loader",
    async loadCollection() {
      const entries = await fetchSessions();
      return { entries };
    },
    async loadEntry({ filter }) {
      const entries = await fetchSessions();
      return entries.find((entry) => entry.id === filter.id);
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
