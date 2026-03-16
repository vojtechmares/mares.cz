import { z } from "astro/zod";
import { defineLiveCollection } from "astro:content";
import { sessionLoader } from "./lib/loaders/session-loader";

const session = defineLiveCollection({
  loader: sessionLoader(async () => {
    const {
      SESSIONS_API_URL,
      SESSIONS_OIDC_ISSUER,
      SESSIONS_OIDC_CLIENT_ID,
      SESSIONS_OIDC_CLIENT_SECRET,
      SESSIONS_OIDC_AUDIENCE,
    } = await import("astro:env/server");
    return {
      apiUrl: SESSIONS_API_URL,
      oidcIssuer: SESSIONS_OIDC_ISSUER,
      clientId: SESSIONS_OIDC_CLIENT_ID,
      clientSecret: SESSIONS_OIDC_CLIENT_SECRET,
      oidcAudience: SESSIONS_OIDC_AUDIENCE,
    };
  }),
  schema: z.object({
    trainingID: z.number(),
    name: z.string(),
    dates: z.object({
      start: z.string(),
      end: z.string().optional(),
    }),
    location: z.string(),
    pricing: z.array(z.object({ amount: z.number(), currency: z.enum(["CZK", "EUR"]) })),
    signUpURL: z.string().url().optional(),
  }),
});

export const collections = { session };
