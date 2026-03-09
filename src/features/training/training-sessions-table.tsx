import type { TrainingSession } from "../../lib/sessions";

import { Button } from "../../components/ui/button";
import { Link } from "../../components/ui/link";
import { Text } from "../../components/ui/text";
import { FormatTrainingDate, FormatTrainingPrice } from "../../lib/training";

type TrainingSessionTableProps = {
  sessions: TrainingSession[];
};

export function TrainingSessionsTable({ sessions }: TrainingSessionTableProps) {
  return (
    <div className="divide-y divide-zinc-300">
      {sessions.map((training) => (
        <article key={`${training.name}-${training.dates?.start}`} className="py-6 md:py-8">
          {/* Mobile layout */}
          <div className="md:hidden">
            <p className="font-display text-lg font-semibold text-zinc-900 tabular-nums">
              <TrainingDate dates={training.dates} />
            </p>
            <p className="text-base text-zinc-500">9:00–17:00</p>
            <p className="mt-1 text-base font-semibold text-zinc-500">{training.location}</p>
            <h3 className="font-display mt-3 text-xl font-semibold tracking-[-0.01em]">
              {training.trainingSlug ? (
                <Link href={`/skoleni/${training.trainingSlug}`}>{training.name}</Link>
              ) : (
                training.name
              )}
            </h3>
            {training.trainingDescription && (
              <p className="mt-1 text-base text-zinc-600">{training.trainingDescription}</p>
            )}
            <div className="mt-4 flex items-center gap-4">
              {training.signUpURL ? (
                <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} />
              ) : (
                <SigningUpNotOpenYet />
              )}
              <TrainingPrice price={training.price} />
            </div>
          </div>

          {/* Desktop layout: 3-column grid */}
          <div className="hidden md:grid md:grid-cols-[180px_1fr_auto] md:items-center md:gap-8">
            <div>
              <p className="font-display text-lg font-semibold text-zinc-900 tabular-nums">
                <TrainingDate dates={training.dates} />
              </p>
              <p className="text-base text-zinc-500">9:00–17:00</p>
              <p className="mt-1 text-base font-semibold text-zinc-500">{training.location}</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">
                {training.trainingSlug ? (
                  <Link href={`/skoleni/${training.trainingSlug}`}>{training.name}</Link>
                ) : (
                  training.name
                )}
              </h3>
              {training.trainingDescription && (
                <p className="mt-1 text-base text-zinc-600">{training.trainingDescription}</p>
              )}
            </div>
            <div className="flex items-center gap-6">
              <TrainingPrice price={training.price} />
              {training.signUpURL ? (
                <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} />
              ) : (
                <SigningUpNotOpenYet />
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CompactTrainingSessionsTable({ sessions }: TrainingSessionTableProps) {
  return (
    <div className="divide-y divide-zinc-300">
      {sessions.map((training) => (
        <article key={`${training.name}-${training.dates?.start}`} className="py-6 md:py-8">
          {/* Mobile layout */}
          <div className="md:hidden">
            <p className="font-display text-lg font-semibold text-zinc-900 tabular-nums">
              <TrainingDate dates={training.dates} />
            </p>
            <p className="text-base text-zinc-500">9:00–17:00</p>
            <p className="mt-1 text-base font-semibold text-zinc-500">{training.location}</p>
            <div className="mt-4">
              {training.signUpURL ? (
                <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} />
              ) : (
                <SigningUpNotOpenYet />
              )}
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="font-display text-lg font-semibold text-zinc-900 tabular-nums">
                <TrainingDate dates={training.dates} />
              </p>
              <p className="text-base text-zinc-500">9:00–17:00</p>
              <p className="mt-1 text-base font-semibold text-zinc-500">{training.location}</p>
            </div>
            <div>
              {training.signUpURL ? (
                <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} />
              ) : (
                <SigningUpNotOpenYet />
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

function TrainingPrice({ price }: { price: number }) {
  const tax = 1.21; // 21%

  const inclTax = FormatTrainingPrice(price * tax);
  const exclTax = FormatTrainingPrice(price);

  return (
    <div className="text-right text-zinc-700 tabular-nums">
      <p className="text-base font-semibold">{inclTax}</p>
      <p className="text-base italic">{exclTax} bez DPH</p>
    </div>
  );
}

function PublicSessionSignUpButton({ name, signUpURL }: { name: string; signUpURL: string }) {
  return (
    <Button href={signUpURL} variant="accent">
      Přihlásit se
      <span className="sr-only">na školení {name}</span>
    </Button>
  );
}

function SigningUpNotOpenYet() {
  return <Text variant="muted">Přihlašování zatím není možné</Text>;
}
