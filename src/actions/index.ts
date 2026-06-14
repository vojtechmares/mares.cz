import { defineAction } from "astro:actions";
import { ECOMAIL_API_KEY, ECOMAIL_TRAINING_LIST_ID } from "astro:env/server";
// `astro:schema` is deprecated in Astro 6 (removed in 7); import zod from astro/zod.
import { z } from "astro/zod";

import { HONEYPOT_FIELD, subscribeToEcomail, validateSignup, type NewsletterSignupResponse } from "@/lib/newsletter";

export const server = {
  newsletter: {
    signup: defineAction({
      accept: "json",
      // Loose schema on purpose: validateSignup is the authoritative validator (it
      // produces the field-error codes the client maps to localized messages), so we
      // let every submission through to the handler rather than failing in Zod. All
      // fields are optional; unknown keys are silently stripped by Zod.
      input: z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        locale: z.string().optional(),
        trainingSlug: z.string().nullable().optional(),
        consent: z.boolean().optional(),
        [HONEYPOT_FIELD]: z.string().optional(),
      }),
      handler: async (input): Promise<NewsletterSignupResponse> => {
        // Honeypot: a real user never fills this hidden field. If it's set, pretend
        // success and skip Ecomail entirely so bots get no signal.
        const honeypot = input[HONEYPOT_FIELD];
        if (typeof honeypot === "string" && honeypot.trim() !== "") {
          return { ok: true, status: 6 };
        }

        const parsed = validateSignup(input);
        if (!parsed.ok) {
          return { ok: false, error: "validation", fields: parsed.fields };
        }

        return subscribeToEcomail(parsed.value, {
          apiKey: ECOMAIL_API_KEY,
          listId: ECOMAIL_TRAINING_LIST_ID,
        });
      },
    }),
  },
};
