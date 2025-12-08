import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  setCookieConsent: defineAction({
    input: z.object({
      consent: z.enum(["accept", "deny"]),
    }),
    handler: async (input, context) => {
      // Set cookie that expires in 1 year
      context.cookies.set("cookie-consent", input.consent, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
        sameSite: "lax",
        secure: true,
        httpOnly: true,
      });

      return { success: true };
    },
  }),
};
