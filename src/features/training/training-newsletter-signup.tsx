import { actions } from "astro:actions";
import { useId, useState } from "react";

import { t, type Locale } from "@/i18n";
import { EMAIL_REGEX, HONEYPOT_FIELD, type NewsletterFieldErrors } from "@/lib/newsletter";

type Props = {
  locale: Locale;
  /** Present on a training page; omitted on the public-sessions page. */
  trainingSlug?: string;
};

type Status = "idle" | "submitting" | "success_confirm" | "success_already" | "error";

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
      const { data, error } = await actions.newsletter.signup({
        name: name.trim(),
        email: email.trim(),
        locale,
        trainingSlug: trainingSlug ?? null,
        consent,
        [HONEYPOT_FIELD]: honeypot,
      });

      if (error) {
        setStatus("error");
      } else if (data.ok) {
        setStatus(data.status === 1 ? "success_already" : "success_confirm");
      } else if (data.error === "validation") {
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
    <div className="panel">
      <h3 className="panel__heading">{t(locale, "newsletter.heading")}</h3>
      <p className="lead-sm" style={{ marginTop: 12 }}>
        {t(locale, "newsletter.description")}
      </p>
      <p className="note" style={{ marginTop: 8 }}>
        {t(locale, "newsletter.cadence")} {t(locale, "newsletter.czech_only_note")}
      </p>

      {succeeded ? (
        <output aria-live="polite" className="note note--status">
          <span className="dot" aria-hidden="true" />
          {t(locale, status === "success_already" ? "newsletter.success_already" : "newsletter.success_confirm")}
        </output>
      ) : (
        <form onSubmit={handleSubmit} aria-busy={submitting} className="form" noValidate>
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

          <div className="field">
            <label className="field__label" htmlFor={`${fieldId}-name`}>
              {t(locale, "newsletter.name_label")}
            </label>
            <input
              className="field__input"
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
              <p id={`${fieldId}-name-error`} className="field__error">
                {fieldError("name")}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor={`${fieldId}-email`}>
              {t(locale, "newsletter.email_label")}
            </label>
            <input
              className="field__input"
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
              <p id={`${fieldId}-email-error`} className="field__error">
                {fieldError("email")}
              </p>
            )}
          </div>

          <div className="field">
            <label className="check" htmlFor={`${fieldId}-consent`}>
              <input
                id={`${fieldId}-consent`}
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                required
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={describe("consent")}
              />
              <span>{t(locale, "newsletter.consent_label")}</span>
            </label>
            {fieldError("consent") && (
              <p id={`${fieldId}-consent-error`} className="field__error">
                {fieldError("consent")}
              </p>
            )}
          </div>

          {status === "error" && (
            <p role="alert" className="field__error">
              {t(locale, "newsletter.error_message")}
            </p>
          )}

          <div>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? t(locale, "newsletter.submitting") : t(locale, "newsletter.submit")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
