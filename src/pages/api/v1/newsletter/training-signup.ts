import type { APIRoute } from "astro";
import { ECOMAIL_API_KEY, ECOMAIL_TRAINING_LIST_ID } from "astro:env/server";

import {
  buildEcomailTags,
  HONEYPOT_FIELD,
  splitFullName,
  validateSignup,
  type NewsletterSignupResponse,
} from "../../../../lib/newsletter";

export const prerender = false;

function json(body: NewsletterSignupResponse, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  // Honeypot: a real user never fills this hidden field. If it's set, pretend
  // success and skip Ecomail entirely so bots get no signal.
  const honeypot = (body as Record<string, unknown> | null)?.[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return json({ ok: true, status: 6 });
  }

  const parsed = validateSignup(body);
  if (!parsed.ok) {
    return json({ ok: false, error: "validation", fields: parsed.fields }, 400);
  }

  const { name, surname } = splitFullName(parsed.value.name);

  try {
    const res = await fetch(`https://api.ecomail.cz/lists/${ECOMAIL_TRAINING_LIST_ID}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        key: ECOMAIL_API_KEY,
      },
      body: JSON.stringify({
        subscriber_data: {
          name,
          surname,
          email: parsed.value.email,
          tags: buildEcomailTags(parsed.value),
        },
        // Double opt-in is enabled on the list: Ecomail sends the confirmation
        // email itself. Don't fire autoresponders before the user confirms.
        trigger_autoresponders: false,
        update_existing: true,
        resubscribe: false,
        skip_confirmation: false,
      }),
    });

    if (!res.ok) {
      console.error(`Ecomail subscribe failed: ${res.status} ${await res.text().catch(() => "")}`);
      return json({ ok: false, error: "ecomail_failed" }, 502);
    }

    const data = (await res.json().catch(() => ({}))) as { status?: number };
    const status = data.status === 1 || data.status === 2 || data.status === 6 ? data.status : 6;
    return json({ ok: true, status });
  } catch (error) {
    console.error("Ecomail subscribe error", error);
    return json({ ok: false, error: "ecomail_failed" }, 502);
  }
};
