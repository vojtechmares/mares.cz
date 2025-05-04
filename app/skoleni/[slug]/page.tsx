import Image from "next/image"
import clsx from "clsx"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import type { Training } from "@/lib/strapi/types/training"
import { Container } from "@/components/Container"
import { Button } from "@/components/Button"
import { strapi } from "@/lib/strapi/strapi"
import { markdownToHtml } from "@/lib/markdown-to-html"

export const dynamic = "force-dynamic"

async function getTraining(slug: string): Promise<Training> {
  const training = await strapi.getTraining(slug)

  return training
}

type Params = Promise<{ slug: string }>

export async function generateMetadata(props: {
  params: Params
}): Promise<Metadata> {
  const { slug } = await props.params
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

function Logo({ training }: { training: Training }) {
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

export default async function Training(props: { params: Params }) {
  const formatter = new Intl.NumberFormat("cs", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  })

  const { slug } = await props.params

  try {
    const training = await getTraining(slug)

    const html = await markdownToHtml(training.content)

    return (
      <main>
        <div className="pb-14 sm:pb-20 lg:pb-32">
          <div className="bg-black pt-16 pb-16">
            <Container className="flex justify-around">
              <Logo training={training} />
              <h2 className="font-display ml-4 self-center text-center text-4xl font-black tracking-tight text-white sm:text-6xl">
                Školení {training.title}
              </h2>
            </Container>
          </div>
          <Container className={training.publishedAt === null ? "hidden" : ""}>
            <div className="mt-12 md:grid md:grid-cols-5 md:gap-x-4 md:gap-y-4">
              <div className="md:col-span-3">
                <div className="prose:text-black prose prose-h1:text-4xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-medium prose-h3:text-xl prose-h3:font-medium prose-p:text-slate-700 prose-li:my-0">
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              </div>
              <div className="mt-8 md:col-span-2 md:mt-0">
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
                <div className="mt-8 overflow-hidden rounded-lg bg-slate-50 shadow-sm md:mt-0">
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
