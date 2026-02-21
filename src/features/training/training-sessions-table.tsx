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
    <table className="w-full divide-y divide-gray-300 tabular-nums">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 pr-3 pl-4 text-left font-semibold text-zinc-900 sm:pl-0">
            Školení
          </th>
          <th scope="col" className="hidden px-3 py-3.5 text-left font-semibold text-zinc-900 md:table-cell">
            Datum
          </th>
          <th scope="col" className="hidden px-3 py-3.5 text-left font-semibold text-zinc-900 md:table-cell">
            Místo
          </th>
          <th scope="col" className="hidden px-3 py-3.5 text-left font-semibold text-zinc-900 md:table-cell">
            Cena
          </th>
          <th scope="col" className="relative hidden py-3.5 pr-4 pl-3 sm:pr-0 md:table-cell">
            <span className="sr-only">Přihlásit se</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-300">
        {sessions.map((training) => (
          <tr key={`${training.name}-${training.dates?.start}`}>
            <td className="py-4 pr-3 pl-4 font-medium whitespace-nowrap text-zinc-900 sm:pl-0">
              {training.trainingSlug ? (
                <Link href={`/skoleni/${training.trainingSlug}`}>{training.name}</Link>
              ) : (
                training.name
              )}
              <dl className="py-4 md:hidden">
                <dt className="sr-only">Datum</dt>
                <dd className="font-normal text-zinc-700">
                  <TrainingDate dates={training.dates} />
                </dd>
                <dt className="sr-only">Místo</dt>
                <dd className="font-normal text-zinc-700">{training.location}</dd>
                <dt className="sr-only">Cena</dt>
                <dd className="font-normal text-zinc-700">
                  <TrainingPrice price={training.price} />
                </dd>
                <dt className="sr-only">Přihlásit se</dt>
                <dd className="mt-4 font-normal text-zinc-700">
                  {training.signUpURL ? (
                    <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} />
                  ) : (
                    <SigningUpNotOpenYet />
                  )}
                </dd>
              </dl>
            </td>
            <td className="hidden px-3 py-4 whitespace-nowrap text-zinc-700 md:table-cell">
              <TrainingDate dates={training.dates} />
            </td>
            <td className="hidden px-3 py-4 whitespace-nowrap text-zinc-700 md:table-cell">{training.location}</td>
            <td className="hidden px-3 py-4 whitespace-nowrap text-zinc-700 md:table-cell">
              <TrainingPrice price={training.price} />
            </td>
            <td className="relative hidden py-4 pr-4 pl-3 text-right font-medium whitespace-nowrap sm:pr-0 md:table-cell">
              {training.signUpURL ? (
                <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} />
              ) : (
                <SigningUpNotOpenYet />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function CompactTrainingSessionsTable({ sessions }: TrainingSessionTableProps) {
  return (
    <table className="min-w-full tabular-nums md:divide-y md:divide-zinc-300">
      <thead>
        <tr>
          <th scope="col" className="hidden py-3.5 text-left font-semibold text-zinc-900 md:table-cell">
            Datum
          </th>
          <th scope="col" className="hidden py-3.5 text-left font-semibold text-zinc-900 md:table-cell">
            Místo
          </th>
          {/* <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left font-semibold text-zinc-900 md:table-cell"
                    >
                        Cena
                    </th> */}
          <th scope="col" className="relative hidden py-3.5 pr-4 pl-3 sm:pr-0 md:table-cell">
            <span className="sr-only">Přihlásit se</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-300">
        {sessions.map((training) => (
          <tr key={`${training.name}-${training.dates?.start}`}>
            <td className="py-4 font-medium whitespace-nowrap text-zinc-900">
              <TrainingDate dates={training.dates} />
              <dl className="py-4 md:hidden">
                <dt className="sr-only">Místo</dt>
                <dd className="font-normal text-zinc-700">{training.location}</dd>
                {/* <dt className="sr-only">Cena</dt>
                                <dd className="font-normal text-zinc-700">
                                    <TrainingPrice price={training.price} />
                                </dd> */}
                <dt className="sr-only">Přihlásit se</dt>
                <dd className="mt-4 font-normal text-zinc-700">
                  {training.signUpURL ? (
                    <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} />
                  ) : (
                    <SigningUpNotOpenYet />
                  )}
                </dd>
              </dl>
            </td>
            <td className="hidden py-4 whitespace-nowrap text-zinc-700 md:table-cell">{training.location}</td>
            {/* <td className="hidden px-3 py-4 whitespace-nowrap text-zinc-700 md:table-cell">
                            <TrainingPrice price={training.price} />
                        </td> */}
            <td className="relative hidden py-4 pr-4 pl-3 text-right font-medium whitespace-nowrap sm:pr-0 md:table-cell">
              {training.signUpURL ? (
                <PublicSessionSignUpButton name={training.name} signUpURL={training.signUpURL} />
              ) : (
                <SigningUpNotOpenYet />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type TrainingDateProps = {
  dates: {
    start: string;
    end?: string;
  };
};

function TrainingDate({ dates }: TrainingDateProps) {
  const start = FormatTrainingDate(dates.start);

  if (typeof dates.end !== "undefined" && dates.end !== null) {
    const end = FormatTrainingDate(dates.end);

    return (
      <>
        {start} - {end}
      </>
    );
  }

  return <>{start}</>;
}

function TrainingPrice({ price }: { price: number }) {
  const tax = 1.21; // 21%

  const inclTax = FormatTrainingPrice(price * tax);
  const exclTax = FormatTrainingPrice(price);

  return (
    <>
      {exclTax} ({inclTax} vč. DPH)
    </>
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
