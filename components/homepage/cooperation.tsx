import clsx from "clsx"

import {Container} from "@/components/Container"
import {Heading} from "@/components/ui/heading"
import {Section} from "@/components/ui/section"

const steps = [
  {
    name: "Analýza současného stavu",
    description:
      "Identifikujeme slabá místa ve vaší infrastruktuře, aplikaci nebo obojím. ",
  },
  {
    name: "Návrh řešení",
    description:
      "Navrhnu efektivní řešení, jak tato slabá místa odstranit, upozorním na rizika a společně naplánujeme případné další kroky.",
  },
  {
    name: "Implementace",
    description:
      "Přesunu vaši aplikaci do Kubernetes, ať už na vašem vlastním hardware, nebo v public cloudu. Veškerá infrastruktura bude jasně definovaná jako kód pomocí Terraformu.",
  },
  {
    name: "Školení vašeho týmu",
    description:
      "Naučím vás používat moderní technologie tak, aby byly efektivním nástrojem pro rozvoj vašich aplikací a byznysu a ne břemenem.",
  },
  {
    name: "Dlouhodobá spolupráce a podpora",
    description:
      "Budeme průběžně rozvíjet infrastrukturu podle aktuálních potřeb vašich aplikací. Nabízím také možnost podpory a SLA, díky čemuž získáte jistotu a rychlé řešení v případě jakýchkoli problémů.",
  },
]

export function Cooperation() {
  return (
    <Section
      id="z-nuly-do-cloudu"
      aria-label="Z nuly do cloudu"
      background="black"
    >
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <Heading level="h2" text="white">
            Z nuly do cloudu
          </Heading>
          <p className="mt-4 text-lg tracking-tight text-slate-300">
            Jak může vypadat naše spolupráce.
          </p>
        </div>
        <nav aria-label="Progress">
          <ol
            role="list"
            className="mx-auto mt-10 max-w-3xl overflow-hidden pt-2"
          >
            {steps.map((step, stepIdx) => (
              <li
                key={step.name}
                className={clsx(
                  stepIdx !== steps.length - 1 ? "pb-10" : "",
                  "relative",
                )}
              >
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute top-4 left-6 mt-0.5 -ml-px h-full w-0.5 bg-white"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-white">
                      <span className="h-3 w-3 rounded-full bg-black" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-2xl font-normal text-white">
                      {step.name}
                    </span>
                    <span className="text-lg text-slate-300">
                      {step.description}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </Section>
  )
}
