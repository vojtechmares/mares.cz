import Image from "next/image"
import clsx from "clsx"
import {Metadata} from "next"
import {notFound} from "next/navigation"

import type {Training} from "@/lib/strapi/types/training"
import {Container} from "@/components/Container"
import {Button} from "@/components/Button"
import {strapi} from "@/lib/strapi/strapi"
import {markdownToHtml} from "@/lib/markdown-to-html"
import {Heading} from "@/components/ui/heading"
import {
  FormatTrainingDate,
  FormatTrainingPrice,
  TrainingSession,
} from "@/lib/training"
import {notion} from "@/lib/notion"

// Next.js will invalidate the cache when a
// request comes in, at most once every 24 hours.
export const revalidate = 86_400

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true

async function getTraining(slug: string): Promise<Training> {
  return await strapi.getTraining(slug)
}

type Params = Promise<{slug: string}>

export async function generateMetadata(props: {
  params: Params
}): Promise<Metadata> {
  const {slug} = await props.params
  const training = await getTraining(slug)

  return {
    title:
      training.title +
      " | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
    description: training.description,
    keywords: training.keywords,
    alternates: {
      canonical: "/skoleni/" + slug,
    },
    openGraph: {
      url: "https://www.mares.cz/skoleni/" + slug,
      type: "article",
      siteName:
        "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
      title:
        training.title +
        " | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
      description: training.description,
    },
    twitter: {
      card: "summary_large_image",
      site: "@vojtechmares_",
      creator: "@vojtechmares_",
      title:
        training.title +
        " | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
      description: training.description,
    },
  }
}

function Logo({training}: {training: Training}) {
  let imageURL = training.logo?.formats.small?.url

  if (imageURL === undefined) {
    imageURL = training.logo?.formats.thumbnail?.url
  }

  if (imageURL === undefined) {
    // using SVG icon as fallback
    imageURL = training.icon?.url
  }

  if (imageURL === undefined) {
    return <></>
  }

  return (
    <Image
      src={imageURL}
      alt=""
      width="100"
      height="100"
      priority
      className={clsx("h-32 w-auto", imageURL.endsWith(".svg") ? "invert" : "")}
    />
  )
}

type TrainingSessionsTableProps = {
  sessions: TrainingSession[]
}

function TrainingSessionsTable({sessions}: TrainingSessionsTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
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
              <TrainingDate dates={training.dates} />
              <dl className="py-4 md:hidden">
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

export default async function Training(props: {params: Params}) {
  const formatter = new Intl.NumberFormat("cs", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  })

  const {slug} = await props.params

  try {
    const training = await getTraining(slug)
    const html = await markdownToHtml(training.content)

    const allSessions = await notion.GetFutureTrainingSessionsForSlug(slug)
    const sessions = allSessions.filter(
      (session) => session.signUpFormURL !== null,
    )

    return (
      <main>
        <div className="pb-14 sm:pb-20 lg:pb-32">
          <div className="bg-black pt-16 pb-16">
            <Container className="flex justify-around">
              <Logo training={training} />
              <h1 className="font-display ml-4 self-center text-center text-4xl font-black tracking-tight text-white sm:text-6xl">
                Školení {training.title}
              </h1>
            </Container>
          </div>
          <Container className={training.publishedAt === null ? "hidden" : ""}>
            <div className="mt-12 md:grid md:grid-cols-5 md:gap-x-4 md:gap-y-4">
              <div className="md:col-span-3">
                <div className="prose:text-black prose prose-h1:text-4xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-medium prose-h3:text-xl prose-h3:font-medium prose-p:text-slate-700 prose-li:my-0">
                  <div dangerouslySetInnerHTML={{__html: html}} />
                </div>
              </div>
              <div className="mt-8 md:col-span-2 md:mt-0">
                {sessions.length > 0 ? (
                  <div className="mb-4">
                    <Heading level="h2">Veřejné termíny školení</Heading>
                    <TrainingSessionsTable sessions={sessions} />
                  </div>
                ) : (
                  <></>
                )}
                {training.days === 2 ? (
                  <div className="mb-8 rounded-lg bg-blue-50 p-4 shadow-sm">
                    <div className="flex">
                      <div className="shrink-0">
                        {/* <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" /> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5 text-blue-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-blue-600">
                          Toto školení je{" "}
                          <span className="font-medium">dvoudenní.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="overflow-hidden rounded-lg bg-slate-50 shadow-sm">
                  <div className="px-4 pt-5 sm:px-6">
                    <h2 className="text-2xl font-medium tracking-tight text-black">
                      Cena za školení
                    </h2>
                  </div>
                  <div className="px-4 pt-2 pb-5">
                    <dl className="sm:divide-y sm:divide-slate-400">
                      <div className="py-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 sm:py-5">
                        <dt className="font-medium text-slate-700">
                          Veřejný termín
                        </dt>
                        <dd className="mt-1 text-black sm:mt-0">
                          {formatter.format(training.priceOpen)} bez DPH
                        </dd>
                      </div>
                      <div className="py-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 sm:py-5">
                        <dt className="font-medium text-slate-700">
                          Firemní školení
                        </dt>
                        <dd className="mt-1 text-black sm:mt-0">
                          {formatter.format(training.priceCorporate)} bez DPH
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="mt-8">
                  <Button
                    variant="solid"
                    color="amber"
                    className="w-full text-lg font-medium"
                    href="mailto:vojtech@mares.cz"
                  >
                    Nezávazně poptat
                  </Button>
                </div>
              </div>
            </div>
          </Container>
          <Container
            className={
              training.publishedAt !== null
                ? "hidden"
                : "my-32 flex justify-center"
            }
          >
            <h1 className="text-4xl font-bold">
              Toto školení teprve připravuji.
            </h1>
          </Container>
        </div>
      </main>
    )
  } catch (error) {
    notFound()
  }
}
