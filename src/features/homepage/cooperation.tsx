import clsx from "clsx";

import { Body } from "../../components/ui/body";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";

const steps = [
  {
    name: "Analýza současného stavu",
    description: "Identifikujeme slabá místa ve vaší infrastruktuře, aplikaci nebo obojím. ",
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
];

export function Cooperation() {
  return (
    <Section id="z-nuly-do-cloudu" aria-label="Z nuly do cloudu" variant="inverse">
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <Heading level="h2" variant="inverse">
            Z nuly do cloudu
          </Heading>
          <Text variant="muted" className="mt-4 tracking-tight">
            Jak může vypadat naše spolupráce.
          </Text>
        </div>
        <nav aria-label="Progress">
          <ol role="list" className="mx-auto mt-10 max-w-3xl overflow-hidden pt-2">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={clsx(stepIdx !== steps.length - 1 ? "pb-10" : "", "relative")}>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute top-4 left-6 mt-0.5 -ml-px h-full w-0.5 bg-white" aria-hidden="true" />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center border-2 border-amber-500 bg-white">
                      <span className="h-3 w-3 bg-zinc-900" />
                    </span>
                  </span>
                  <Body as="span" className="ml-4 flex min-w-0 flex-col">
                    <Body as="span" color="inverse" className="text-2xl font-normal">
                      {step.name}
                    </Body>
                    <Body as="span" color="muted" variant="lg">
                      {step.description}
                    </Body>
                  </Body>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </Section>
  );
}
