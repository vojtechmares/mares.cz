import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Body } from "@/components/ui/body";
import { t, type Locale } from "@/i18n";
import {
  EMAIL_REGEX,
  HONEYPOT_FIELD,
  type NewsletterFieldErrors,
  type NewsletterSignupResponse,
} from "@/lib/newsletter";

type Props = {
  locale: Locale;
  /** Present on a training page; omitted on the public-sessions page. */
  trainingSlug?: string;
};

type Status = "idle" | "submitting" | "success_confirm" | "success_already" | "error";

const ENDPOINT = "/api/v1/newsletter/training-signup";

export function TrainingNewsletterSignUp({ locale, trainingSlug }: Props) {
  const fieldId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<NewsletterFieldErrors>({});

  const submitting = status === "submitting";
  const succeeded = status === "success_confirm" || status === "success_already";

  function clientValidate(): NewsletterFieldErrors {
    const next: NewsletterFieldErrors = {};
    if (!name.trim()) next.name = "required";
    if (!email.trim()) next.email = "required";
    else if (!EMAIL_REGEX.test(email.trim())) next.email = "invalid";
    if (!consent) next.consent = "required";
    return next;
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (submitting) return;

    const validationErrors = clientValidate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          locale,
          trainingSlug: trainingSlug ?? null,
          consent,
          [HONEYPOT_FIELD]: honeypot,
        }),
      });
      const data = (await res.json().catch(() => null)) as NewsletterSignupResponse | null;

      if (res.ok && data?.ok) {
        setStatus(data.status === 1 ? "success_already" : "success_confirm");
      } else if (data && !data.ok && data.error === "validation") {
        setErrors(data.fields);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function fieldError(field: keyof NewsletterFieldErrors): string | null {
    const code = errors[field];
    if (!code) return null;
    if (field === "consent") return t(locale, "newsletter.error_consent");
    if (field === "email" && code === "invalid") return t(locale, "newsletter.error_email");
    return t(locale, "newsletter.error_required");
  }

  const describe = (field: keyof NewsletterFieldErrors) => (errors[field] ? `${fieldId}-${field}-error` : undefined);

  return (
    <Card variant="surface">
      <Heading level="h3">{t(locale, "newsletter.heading")}</Heading>
      <Body color="secondary" className="mt-3">
        {t(locale, "newsletter.description")}
      </Body>
      <Body variant="small" color="secondary" className="mt-2">
        {t(locale, "newsletter.cadence")} {t(locale, "newsletter.czech_only_note")}
      </Body>

      {succeeded ? (
        <output aria-live="polite" className="mt-6 block">
          <Body color="primary" className="font-medium">
            {t(locale, status === "success_already" ? "newsletter.success_already" : "newsletter.success_confirm")}
          </Body>
        </output>
      ) : (
        <form onSubmit={handleSubmit} aria-busy={submitting} className="mt-6 flex flex-col gap-4" noValidate>
          {/* Honeypot: hidden from users and assistive tech; bots tend to fill it. */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
            <label htmlFor={`${fieldId}-${HONEYPOT_FIELD}`}>Company website</label>
            <input
              id={`${fieldId}-${HONEYPOT_FIELD}`}
              name={HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${fieldId}-name`}>{t(locale, "newsletter.name_label")}</Label>
            <Input
              id={`${fieldId}-name`}
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describe("name")}
            />
            {fieldError("name") && (
              <p id={`${fieldId}-name-error`} className="text-sm text-red-700">
                {fieldError("name")}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${fieldId}-email`}>{t(locale, "newsletter.email_label")}</Label>
            <Input
              id={`${fieldId}-email`}
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describe("email")}
            />
            {fieldError("email") && (
              <p id={`${fieldId}-email-error`} className="text-sm text-red-700">
                {fieldError("email")}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2">
              <Checkbox
                id={`${fieldId}-consent`}
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
                required
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={describe("consent")}
                className="mt-0.5"
              />
              <Label htmlFor={`${fieldId}-consent`}>{t(locale, "newsletter.consent_label")}</Label>
            </div>
            {fieldError("consent") && (
              <p id={`${fieldId}-consent-error`} className="text-sm text-red-700">
                {fieldError("consent")}
              </p>
            )}
          </div>

          {status === "error" && (
            <p role="alert" className="text-sm text-red-700">
              {t(locale, "newsletter.error_message")}
            </p>
          )}

          <div className="mt-2">
            <Button variant="accent" size="large">
              {submitting ? t(locale, "newsletter.submitting") : t(locale, "newsletter.submit")}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
