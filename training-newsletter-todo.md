# Training newsletter signup - follow-ups

The "training news" signup (Ecomail) shipped with a few deliberate shortcuts. These
are the open follow-ups.

## 1. Privacy policy page + consent link (required before wide promotion)

The consent checkbox currently uses an inline data-use sentence with **no link**
(`newsletter.consent_label` in `src/i18n/translations/{cs,en}.ts`).

- [ ] Create a privacy/GDPR page, e.g. `/zasady-ochrany-osobnich-udaju` (+ `/en`
      variant), as a `page` content entry.
- [ ] Update `newsletter.consent_label` to link to it (the label is rendered in
      `src/features/training/training-newsletter-signup.tsx`).

## 2. Vercel Firewall rate-limit rule (anti-spam, server side)

The form has an in-code **honeypot** (`HONEYPOT_FIELD` in `src/lib/newsletter.ts`),
but the rate limit is **not** in code - it must be configured on the platform.

- [ ] In the Vercel dashboard → Firewall, add a rate-limit rule scoped to
      `POST /_actions/newsletter.signup` (the Astro Action endpoint; suggested: ~5
      requests / minute per IP).

## 3. Secrets / Ecomail config

- [ ] Set `ECOMAIL_API_KEY` in local `.env` (currently empty) and in the Vercel
      project env (Production + Preview). `ECOMAIL_TRAINING_LIST_ID` defaults to `2`
      ("Školení").
- [ ] Confirm **double opt-in** is enabled on Ecomail list 2 (the code sends
      `skip_confirmation: false` and relies on Ecomail to send the confirmation email).

## 4. Later / nice-to-have

- [ ] Localized campaigns: subscribers are tagged `lang:cs` / `lang:en` (captured
      silently from the page locale). If the data justifies it, send a localized EN
      campaign and surface a language choice. The newsletter is Czech-only for now
      (`newsletter.czech_only_note`).
- [ ] shadcn migration: this feature bootstrapped shadcn/ui (Sera preset, Base UI).
      Existing `design-tokens.ts` components were intentionally left untouched and the
      shadcn `@layer base` site-wide overrides were trimmed in `src/styles/global.css`.
      Migrate existing components onto shadcn tokens incrementally.
