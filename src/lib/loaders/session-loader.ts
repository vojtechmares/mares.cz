import type { LiveLoader } from "astro/loaders";
import { BackofficeClient, type APISession } from "../backoffice";

interface SessionLoaderConfig {
  apiUrl: string;
  oidcIssuer: string;
  clientId: string;
  clientSecret: string;
  oidcAudience?: string;
}

type SessionLoaderConfigInit = SessionLoaderConfig | (() => SessionLoaderConfig | Promise<SessionLoaderConfig>);

export function sessionLoader(configInit: SessionLoaderConfigInit): LiveLoader {
  const resolveConfig = async (): Promise<SessionLoaderConfig> => {
    const raw = typeof configInit === "function" ? await configInit() : configInit;
    return {
      apiUrl: stripQuotes(raw.apiUrl),
      oidcIssuer: stripQuotes(raw.oidcIssuer),
      clientId: stripQuotes(raw.clientId),
      clientSecret: stripQuotes(raw.clientSecret),
      oidcAudience: raw.oidcAudience ? stripQuotes(raw.oidcAudience) : undefined,
    };
  };

  const fetchSessions = async () => {
    const config = await resolveConfig();

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
    pricing: session.pricing,
    ...(session.signup_url && { signUpURL: session.signup_url }),
  };
}

function stripQuotes(value: string): string {
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function calculateEndDate(startDate: string, lengthDays: number): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + lengthDays - 1);
  return date.toISOString().split("T")[0];
}
