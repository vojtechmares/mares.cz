import clsx from "clsx";

import { Container } from "@/components/Container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

const steps = [
  {
    name: "Analýza současného stavu",
    description:
      "Zjistíme kde jsou slabá místa Vaší infrastruktury nebo aplikace, a nebo obojího.",
  },
  {
    name: "Návrh řešení",
    description:
      "Navrhnu, jak tato slabá místa odstranit, na co si dát pozor a naplánujeme případné další kroky. ",
  },
  {
    name: "Implementace",
    description:
      "Přesunu Vaši aplikaci do Kubernetes, ať na Vašem vlastním hardware nebo v public cloudu. Celá infrastruktura bude jasně deklarovaná jako kód pomocí Terraformu.",
  },
  {
    name: "Školení Vašeho týmu",
    description:
      "Naučím váš tým používat moderní technologie, tak abyste mohli rozvíjet Vaší aplikaci a byznys a technologie byly nástrojem k rozvoji, ne břemenem, které s sebou táhnete.",
  },
  {
    name: "Dlouhodobá spolupráce a support",
    description:
      "Společně budeme rozvíjet infrastrukturu dle potřeb Vaší aplikace. Zároveň Vám mohhu nabídnout i podporu v případě problémů a SLA.",
  },
];

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
          <p className="mt-6 text-lg tracking-tight text-slate-300">
            Jak může vypadat naše spolupráce.
          </p>
        </div>
        <nav aria-label="Progress">
          <ol
            role="list"
            className="mx-auto mt-20 max-w-3xl overflow-hidden pt-2"
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
  );
}
