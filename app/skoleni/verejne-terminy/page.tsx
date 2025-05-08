import {Container} from "@/components/Container"
import {Heading} from "@/components/ui/heading"

import {notion} from "@/lib/notion"
import {Metadata} from "next"
import {
  FormatTrainingDate,
  FormatTrainingPrice,
  TrainingSession,
} from "@/lib/training"
import {Button} from "@/components/Button"
import Link from "next/link"
import {Text} from "@/components/ui/text"

// Next.js will invalidate the cache when a
// request comes in, at most once every 24 hours.
export const revalidate = 86400

export const metadata: Metadata = {
  title:
    "Veřejné termíny školení  | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
  description:
    "Veřejné termíny DevOps školení, kam se může přihlásit úplně každý.",
  keywords: "",
  alternates: {
    canonical: "/skoleni/verejne-terminy",
  },
  openGraph: {
    url: "https://www.mares.cz/skoleni/verejne-terminy",
    type: "article",
    siteName:
      "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
    title:
      "Veřejné termíny školení  | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
    description:
      "Veřejné termíny DevOps školení, kam se může přihlásit úplně každý.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vojtechmares_",
    creator: "@vojtechmares_",
    title:
      "Veřejné termíny školení  | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
    description:
      "Veřejné termíny DevOps školení, kam se může přihlásit úplně každý.",
  },
}

export default async function PublicSessions() {
  const sessions = await notion.GetFutureTrainingSessions()

  return (
    <main>
      <Container className="mb-10">
        <Heading level="h1">Veřejné termíny školení</Heading>
      </Container>
      <Container className="mb-14 sm:mb-20 lg:mb-32">
        <TrainingSessionsTable sessions={sessions} />
        <Text className="mt-4">
          Minimální obsazenost školení, aby se uskutečnilo je 5 osob. Pokud se
          minimální kapacita nenaplní, kontaktuji vás emailem a vrátím peníze.
          Maximální kapacita školení je dle místa, maximálně však 15 osob.
        </Text>
      </Container>
    </main>
  )
}

type TrainingSessionTableProps = {
  sessions: TrainingSession[]
}

function TrainingSessionsTable({sessions}: TrainingSessionTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pr-3 pl-4 text-left font-semibold text-black sm:pl-0"
          >
            Školení
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left font-semibold text-black md:table-cell"
          >
            Datum
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left font-semibold text-black md:table-cell"
          >
            Místo
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left font-semibold text-black md:table-cell"
          >
            Cena
          </th>
          <th
            scope="col"
            className="relative hidden py-3.5 pr-4 pl-3 sm:pr-0 md:table-cell"
          >
            <span className="sr-only">Přihlásit se</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-300">
        {sessions.map((training) => (
          <tr key={`${training.slug}-${training.dates?.start}`}>
            <td className="py-4 pr-3 pl-4 font-medium whitespace-nowrap text-slate-900 sm:pl-0">
              <Link className="underline" href={"/skoleni/" + training.slug}>
                {training.name}
              </Link>
              <dl className="py-4 md:hidden">
                <dt className="sr-only">Datum</dt>
                <dd className="font-normal text-slate-700">
                  <TrainingDate dates={training.dates} />
                </dd>
                <dt className="sr-only">Místo</dt>
                <dd className="font-normal text-slate-700">
                  {training.location}
                </dd>
                <dt className="sr-only">Cena</dt>
                <dd className="font-normal text-slate-700">
                  <TrainingPrice price={training.price} />
                </dd>
                <dt className="sr-only">Přihlásit se</dt>
                <dd className="mt-4 font-normal text-slate-700">
                  {typeof training.signUpFormURL === "string" ? (
                    <PublicSessionSignUpButton
                      name={training.name}
                      signUpFormURL={training.signUpFormURL}
                    />
                  ) : (
                    <SigningUpNotOpenYet />
                  )}
                </dd>
              </dl>
            </td>
            <td className="hidden px-3 py-4 whitespace-nowrap text-slate-700 md:table-cell">
              <TrainingDate dates={training.dates} />
            </td>
            <td className="hidden px-3 py-4 whitespace-nowrap text-slate-700 md:table-cell">
              {training.location}
            </td>
            <td className="hidden px-3 py-4 whitespace-nowrap text-slate-700 md:table-cell">
              <TrainingPrice price={training.price} />
            </td>
            <td className="relative hidden py-4 pr-4 pl-3 text-right font-medium whitespace-nowrap sm:pr-0 md:table-cell">
              {typeof training.signUpFormURL === "string" ? (
                <PublicSessionSignUpButton
                  name={training.name}
                  signUpFormURL={training.signUpFormURL}
                />
              ) : (
                <SigningUpNotOpenYet />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type TrainingDateProps = {
  dates: {
    start: string
    end?: string
  }
}

function TrainingDate({dates}: TrainingDateProps) {
  const start = FormatTrainingDate(dates.start)

  if (typeof dates.end !== "undefined" && dates.end !== null) {
    const end = FormatTrainingDate(dates.end)

    return (
      <>
        {start} - {end}
      </>
    )
  }

  return <>{start}</>
}

function TrainingPrice({price}: {price: number}) {
  const formattedPrice = FormatTrainingPrice(price)

  return <>{formattedPrice}</>
}

function PublicSessionSignUpButton({
  name,
  signUpFormURL,
}: {
  name: string
  signUpFormURL: URL
}) {
  return (
    <Button href={signUpFormURL.toString()}>
      Přihlásit se
      <span className="sr-only">na školení {name}</span>
    </Button>
  )
}

function SigningUpNotOpenYet() {
  return <p>Přihlašování se zatím není možné</p>
}
