import type { Locale } from "../i18n/types";

/**
 * Shared contract for the training-news newsletter signup, used by both the
 * client component (src/features/training/training-newsletter-signup.tsx) and
 * the signup action (src/actions/index.ts).
 */

/** Name of the hidden honeypot field. Bots tend to fill it; humans never see it. */
export const HONEYPOT_FIELD = "company_website";

/** Validated payload the API route forwards to Ecomail. Contains no secrets. */
export type NewsletterSignupInput = {
  /** Full name (single field); split into Ecomail name + surname via splitFullName. */
  name: string;
  email: string;
  /** Page locale, captured silently and stored as a `lang:` tag in Ecomail. */
  locale: Locale;
  /** Training slug when submitted from a training page, otherwise null. */
  trainingSlug: string | null;
};

/** Ecomail subscriber status: 1 = subscribed, 2 = unsubscribed, 6 = unconfirmed. */
export type EcomailStatus = 1 | 2 | 6;

export type NewsletterFieldErrors = Partial<
  Record<keyof NewsletterSignupInput | "consent", "required" | "invalid" | "too_long">
>;

export type NewsletterSignupResponse =
  | { ok: true; status: EcomailStatus }
  | { ok: false; error: "validation"; fields: NewsletterFieldErrors }
  | { ok: false; error: "invalid_json" | "ecomail_failed" };

/** Pragmatic email check (not RFC-perfect; Ecomail does the authoritative validation). */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_SLUG = 160;
const SLUG_REGEX = /^[a-z0-9/-]+$/i;

type RawSignupBody = {
  name?: unknown;
  email?: unknown;
  locale?: unknown;
  trainingSlug?: unknown;
  consent?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export type ValidationResult =
  | { ok: true; value: NewsletterSignupInput }
  | { ok: false; fields: NewsletterFieldErrors };

/**
 * Validate an untrusted signup body. The client validates first for UX, but this
 * is the authoritative check on the server. Honeypot handling lives in the route.
 */
export function validateSignup(body: unknown): ValidationResult {
  const raw = (body ?? {}) as RawSignupBody;
  const fields: NewsletterFieldErrors = {};

  const name = asTrimmedString(raw.name);
  const email = asTrimmedString(raw.email);
  const consent = raw.consent === true;

  if (!name) fields.name = "required";
  else if (name.length > MAX_NAME) fields.name = "too_long";

  if (!email) fields.email = "required";
  else if (email.length > MAX_EMAIL || !EMAIL_REGEX.test(email)) fields.email = "invalid";

  if (!consent) fields.consent = "required";

  // Locale is captured silently from the page; anything other than "en" is "cs".
  const locale: Locale = asTrimmedString(raw.locale) === "en" ? "en" : "cs";

  let trainingSlug: string | null = null;
  if (raw.trainingSlug != null && raw.trainingSlug !== "") {
    const slug = asTrimmedString(raw.trainingSlug);
    if (slug.length > MAX_SLUG || !SLUG_REGEX.test(slug)) fields.trainingSlug = "invalid";
    else trainingSlug = slug;
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields };

  return { ok: true, value: { name, email, locale, trainingSlug } };
}

/** Split a full name into Ecomail name + surname on the first whitespace. */
export function splitFullName(full: string): { name: string; surname: string } {
  const normalized = full.trim().replace(/\s+/g, " ");
  const firstSpace = normalized.indexOf(" ");
  if (firstSpace === -1) return { name: normalized, surname: "" };
  return { name: normalized.slice(0, firstSpace), surname: normalized.slice(firstSpace + 1) };
}

/** Ecomail tags applied to a subscriber, used for future segmentation. */
export function buildEcomailTags(input: NewsletterSignupInput): string[] {
  const tags = ["web-training-news", `lang:${input.locale}`];
  if (input.trainingSlug) tags.push(`training:${input.trainingSlug}`);
  return tags;
}

/**
 * Subscribe a validated signup to Ecomail. Secrets are dependency-injected so this
 * stays framework-agnostic and unit-testable. Maps the Ecomail subscriber status
 * (1 = subscribed, 2 = unsubscribed, 6 = unconfirmed) onto NewsletterSignupResponse.
 */
export async function subscribeToEcomail(
  input: NewsletterSignupInput,
  opts: { apiKey: string; listId: string },
): Promise<NewsletterSignupResponse> {
  const { name, surname } = splitFullName(input.name);

  try {
    const res = await fetch(`https://api.ecomail.cz/lists/${opts.listId}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        key: opts.apiKey,
      },
      body: JSON.stringify({
        subscriber_data: {
          name,
          surname,
          email: input.email,
          tags: buildEcomailTags(input),
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
      return { ok: false, error: "ecomail_failed" };
    }

    const data = (await res.json().catch(() => ({}))) as { status?: number };
    const status: EcomailStatus = data.status === 1 || data.status === 2 || data.status === 6 ? data.status : 6;
    return { ok: true, status };
  } catch (error) {
    console.error("Ecomail subscribe error", error);
    return { ok: false, error: "ecomail_failed" };
  }
}
