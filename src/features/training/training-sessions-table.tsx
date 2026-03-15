import type { TrainingSession } from "../../lib/sessions";

import { Button } from "../../components/ui/button";
import { Link } from "../../components/ui/link";
import { Text } from "../../components/ui/text";
import { FormatTrainingDate, FormatTrainingPrice } from "../../lib/training";
import { t, type Locale } from "../../i18n";
import { localizeUrl } from "../../i18n/routes";

type TrainingSessionTableProps = {
  sessions: TrainingSession[];
  locale: Locale;
};

export function TrainingSessionsTable({ sessions, locale }: TrainingSessionTableProps) {
  return (
    <div className="divide-y divide-zinc-300">
      {sessions.map((training) => (
        <article key={`${training.name}-${training.dates?.start}`} className="py-6 md:py-8">
          {/* Mobile layout */}
          <div className="md:hidden">
            <p className="font-display text-lg font-semibold text-zinc-900 tabular-nums">
              <TrainingDate dates={training.dates} />
            </p>
            <p className="text-base text-zinc-500">{t(locale, "sessions_table.time")}</p>
            <p className="mt-1 text-base font-semibold text-zinc-500">{training.location}</p>
            <h3 className="font-display mt-3 text-xl font-semibold tracking-[-0.01em]">
              {training.trainingSlug ? (
                <Link href={localizeUrl(`/skoleni/${training.trainingSlug}`, locale)}>{training.name}</Link>
              ) : (
                training.name
              )}
            </h3>
            {training.trainingDescription && (
              <p className="mt-1 text-base text-zinc-600">{training.trainingDescription}</p>
            )}
            <div className="mt-4 flex items-center gap-4">
              {training.signUpURL ? (
                <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} locale={locale} />
              ) : (
                <SigningUpNotOpenYet locale={locale} />
              )}
              <TrainingPrice price={training.price} locale={locale} />
            </div>
          </div>

          {/* Desktop layout: 3-column grid */}
          <div className="hidden md:grid md:grid-cols-[180px_1fr_auto] md:items-center md:gap-8">
            <div>
              <p className="font-display text-lg font-semibold text-zinc-900 tabular-nums">
                <TrainingDate dates={training.dates} />
              </p>
              <p className="text-base text-zinc-500">{t(locale, "sessions_table.time")}</p>
              <p className="mt-1 text-base font-semibold text-zinc-500">{training.location}</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">
                {training.trainingSlug ? (
                  <Link href={localizeUrl(`/skoleni/${training.trainingSlug}`, locale)}>{training.name}</Link>
                ) : (
                  training.name
                )}
              </h3>
              {training.trainingDescription && (
                <p className="mt-1 text-base text-zinc-600">{training.trainingDescription}</p>
              )}
            </div>
            <div className="flex items-center gap-6">
              <TrainingPrice price={training.price} locale={locale} />
              {training.signUpURL ? (
                <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} locale={locale} />
              ) : (
                <SigningUpNotOpenYet locale={locale} />
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CompactTrainingSessionsTable({ sessions, locale }: TrainingSessionTableProps) {
  return (
    <div className="divide-y divide-zinc-300">
      {sessions.map((training) => (
        <article key={`${training.name}-${training.dates?.start}`} className="py-6 md:py-8">
          {/* Mobile layout */}
          <div className="md:hidden">
            <p className="font-display text-lg font-semibold text-zinc-900 tabular-nums">
              <TrainingDate dates={training.dates} />
            </p>
            <p className="text-base text-zinc-500">{t(locale, "sessions_table.time")}</p>
            <p className="mt-1 text-base font-semibold text-zinc-500">{training.location}</p>
            <div className="mt-4">
              {training.signUpURL ? (
                <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} locale={locale} />
              ) : (
                <SigningUpNotOpenYet locale={locale} />
              )}
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="font-display text-lg font-semibold text-zinc-900 tabular-nums">
                <TrainingDate dates={training.dates} />
              </p>
              <p className="text-base text-zinc-500">{t(locale, "sessions_table.time")}</p>
              <p className="mt-1 text-base font-semibold text-zinc-500">{training.location}</p>
            </div>
            <div>
              {training.signUpURL ? (
                <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} locale={locale} />
              ) : (
                <SigningUpNotOpenYet locale={locale} />
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

type TrainingDateProps = {
  dates: {
    start: string;
    end?: string;
  };
};

function formatDayMonth(date: Date): string {
  return `${date.getDate()}.${date.getMonth() + 1}.`;
}

function TrainingDate({ dates }: TrainingDateProps) {
  const startDate = new Date(dates.start);

  if (typeof dates.end !== "undefined" && dates.end !== null) {
    const endDate = new Date(dates.end);

    return (
      <>
        {formatDayMonth(startDate)}–{formatDayMonth(endDate)}
        {endDate.getFullYear()}
      </>
    );
  }

  return <>{FormatTrainingDate(dates.start)}</>;
}

function TrainingPrice({ price, locale }: { price: number; locale: Locale }) {
  const tax = 1.21; // 21%

  const inclTax = FormatTrainingPrice(price * tax);
  const exclTax = FormatTrainingPrice(price);

  return (
    <div className="text-right text-zinc-700 tabular-nums">
      <p className="text-base font-semibold">{inclTax}</p>
      <p className="text-base italic">
        {exclTax} {t(locale, "sessions_table.excl_vat")}
      </p>
    </div>
  );
}

function PublicSessionSignUpButton({ name, signUpURL, locale }: { name: string; signUpURL: string; locale: Locale }) {
  return (
    <Button href={signUpURL} variant="accent">
      {t(locale, "sessions_table.sign_up")}
      <span className="sr-only">{t(locale, "sessions_table.sign_up_aria", { name })}</span>
    </Button>
  );
}

function SigningUpNotOpenYet({ locale }: { locale: Locale }) {
  return <Text variant="muted">{t(locale, "sessions_table.sign_up_not_open")}</Text>;
}
