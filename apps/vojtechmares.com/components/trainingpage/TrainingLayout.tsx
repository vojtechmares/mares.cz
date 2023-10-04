import Head from "next/head";
import Image from "next/image";
import clsx from "clsx";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

type Props = {
  content: any;
  meta: any;
}

export default function TrainingLayout({ content, meta }: Props) {
  const formatter = new Intl.NumberFormat("cs", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  });

  return (
    <>
      <Head>
        <title>
          Školení {meta.name} | Vojtěch Mareš - DevOps konzultant, lektor,
          engineer
        </title>

        <meta
          name="description"
          content={`Školení ${meta.name} | Vojtěch Mareš - DevOps konzultant, lektor, engineer`}
        />
      </Head>
      <main>
        <Header />
        <div className="pb-14 sm:pb-20 lg:pb-32">
          <div className="bg-black pt-16 pb-16">
            <Container className="flex justify-around">
              <Image
                src={meta.logo}
                width="1500"
                height="1500"
                alt=""
                priority
                className={clsx(
                  "h-32 w-32 rounded-full",
                  meta.logo.src.endsWith(".svg") ? "invert" : ""
                )}
              />
              <h2 className="ml-4 text-center font-display self-center text-4xl tracking-tight text-white sm:text-6xl">
                Školení {meta.name}
              </h2>
            </Container>
          </div>
          <Container>
            <div className="mt-12 md:grid md:grid-cols-5 md:gap-x-4 md:gap-y-4">
              <div className="md:col-span-3">
                <div className="prose prose:text-black prose-p:text-slate-700 prose-h1:text-2xl prose-h1:font-medium prose-h2:text-xl prose-h2:font-medium prose-h3:text-lg prose-h3:font-medium prose-li:my-0">
                  {content}
                </div>
              </div>
              <div className="mt-8 md:col-span-2 md:mt-0">
                {meta.days === 2 ? (
                  <div className=" mb-8 rounded-lg bg-blue-50 p-4 shadow">
                    <div className="flex">
                      <div className="flex-shrink-0">
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
                          <span className="font-medium">
                            dvoudenní.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="mt-8 overflow-hidden rounded-lg bg-slate-50 shadow md:mt-0">
                  <div className="px-4 pt-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-black">
                      Cena za školení
                    </h3>
                  </div>
                  <div className=" px-4 pb-5 pt-2">
                    <dl className="sm:divide-y sm:divide-slate-400">
                      <div className="py-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:py-5 sm:px-6">
                        <dt className="font-medium text-slate-700">
                          Veřejný termín
                        </dt>
                        <dd className="mt-1 text-black sm:mt-0">
                          {formatter.format(meta.price.open)} bez DPH
                        </dd>
                      </div>
                      <div className="py-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:py-5 sm:px-6">
                        <dt className="font-medium text-slate-700">
                          Firemní školení
                        </dt>
                        <dd className="mt-1 text-black sm:mt-0">
                          {formatter.format(meta.price.company)} bez DPH
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
                    href="mailto:iam@vojtechmares.com"
                  >
                    Nezávazně poptat
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
};
