import { z } from "astro/zod";
import { defineLiveCollection } from "astro:content";
import { sessionLoader } from "./lib/loaders/session-loader";

const session = defineLiveCollection({
  loader: sessionLoader({
    apiUrl: import.meta.env.SESSIONS_API_URL,
    oidcIssuer: import.meta.env.SESSIONS_OIDC_ISSUER,
    clientId: import.meta.env.SESSIONS_OIDC_CLIENT_ID,
    clientSecret: import.meta.env.SESSIONS_OIDC_CLIENT_SECRET,
    oidcAudience: import.meta.env.SESSIONS_OIDC_AUDIENCE,
  }),
  schema: z.object({
    trainingID: z.number(),
    name: z.string(),
    dates: z.object({
      start: z.string(),
      end: z.string().optional(),
    }),
    location: z.string(),
    price: z.number(),
    signUpURL: z.string().url().optional(),
  }),
});

export const collections = { session };
