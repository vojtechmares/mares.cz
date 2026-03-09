import clsx from "clsx";

import { Badge } from "../../components/ui/badge";
import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";

const spolupráceSteps = [
  {
    name: "Úvodní analýza",
    description:
      "Společně zmapujeme váš současný stav — infrastrukturu, procesy i tým. Identifikujeme slabá místa a příležitosti ke zlepšení.",
  },
  {
    name: "Návrh řešení",
    description:
      "Na základě analýzy připravím konkrétní plán kroků s prioritami, časovým odhadem a očekávanými výsledky.",
  },
  {
    name: "Implementace",
    description:
      "Pracuji iterativně — každý sprint přináší měřitelný pokrok. Infrastruktura jako kód, automatizace, Kubernetes.",
  },
  {
    name: "Podpora a SLA",
    description: "Po nasazení nabízím průběžnou podporu s SLA v pracovní dny Po–Pá 9–17 přes e-mail nebo Slack.",
  },
];

const zahrnujeItems = [
  "Správa infrastruktury a IaC (Terraform)",
  "Kubernetes a kontejnerizace",
  "Monitoring, alerting a observabilita",
  "Bezpečnost a pravidelné revize",
  "Škálovatelný rozsah spolupráce",
  "CI/CD pipeline a automatizace",
  "Integrace s AI a agenty",
];

const projektyItems = [
  { label: "Migrace", description: "z/do cloudu i on-premise (oba směry), migrace aplikací do Kubernetes" },
  {
    label: "Cloudová architektura",
    description: "cloud native patterny, spolehlivost a efektivní využití cloudu",
  },
  {
    label: "Budování platform týmu",
    description: "podpora vývojových týmů pomocí DevOps praktik a self-service přístupu",
  },
  { label: "Integrace AI", description: "bezpečná integrace AI a AI agentů do aplikací i platformy" },
];

export function ServicesCooperation() {
  return (
    <Section id="spoluprace" variant="surface" ariaLabel="Spolupráce">
      <Container>
        <Badge variant="accent">Dlouhodobé partnerství</Badge>
        <Heading level="h2" className="mt-4">
          Spolupráce
        </Heading>
        <Body variant="large" className="mt-4 max-w-2xl">
          Dlouhodobé partnerství, při kterém se kompletně postarám o vaši infrastrukturu. Pravidelné aktualizace, rozvoj
          platformy a podpora vašich aplikací — vše s jasně definovanými procesy.
        </Body>

        <nav aria-label="Kroky spolupráce" className="mt-12">
          <ol role="list" className="mx-auto max-w-3xl overflow-hidden pt-2">
            {spolupráceSteps.map((step, idx) => (
              <li key={step.name} className={clsx(idx !== spolupráceSteps.length - 1 ? "pb-10" : "", "relative")}>
                {idx !== spolupráceSteps.length - 1 ? (
                  <div className="absolute top-4 left-6 mt-0.5 -ml-px h-full w-0.5 bg-zinc-300" aria-hidden="true" />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center border-2 border-orange-500 bg-white">
                      <span className="h-3 w-3 bg-zinc-900" />
                    </span>
                  </span>
                  <Body as="span" className="ml-4 flex min-w-0 flex-col">
                    <Body as="span" className="text-2xl font-normal">
                      {step.name}
                    </Body>
                    <Body as="span" color="secondary" variant="large">
                      {step.description}
                    </Body>
                  </Body>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card variant="surface" className="border-t-4 border-orange-500">
            <Heading level="h3">Co spolupráce zahrnuje</Heading>
            <Body as="div" color="secondary" className="mt-4">
              <ul className="list-inside list-disc space-y-2 pl-4">
                {zahrnujeItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Body>
          </Card>

          <Card variant="surface" className="border-l-2 border-zinc-300">
            <Heading level="h3">Pro koho je spolupráce vhodná</Heading>
            <Body color="secondary" className="mt-4">
              Spolupracuji s firmami od startupů po enterprise — na velikosti nezáleží. Přináším technické know-how,
              které firmě chybí, ať už jde o infrastrukturu, automatizaci, nebo DevOps kulturu. Rozsah přizpůsobím vašim
              potřebám — od několika hodin týdně až po zhruba polovinu pracovního týdne.
            </Body>
          </Card>

          <Card variant="surface">
            <Heading level="h3">Dlouhodobá podpora a SLA</Heading>
            <Body color="secondary" className="mt-4">
              Nabízím dlouhodobou podporu s garantovanými reakčními časy. Nenabízím L1 podporu — řeším technické
              problémy na expertní úrovni. Podporu zajišťuji se svým týmem v pracovních hodinách, tj.&nbsp;Po–Pá 9–17.
            </Body>
            <Body color="secondary" className="mt-4">
              Součástí podpory jsou pravidelné revize infrastruktury, proaktivní aktualizace a sledování nových
              technologií. Díky průběžné spolupráci znám vaše prostředí do detailu a dokážu reagovat rychle a efektivně.
            </Body>
          </Card>

          {/* Card 4: Structured numbered list — surface with dark top border */}
          <Card variant="surface" className="border-t-4 border-zinc-900">
            <Heading level="h3">Typické projekty</Heading>
            <div className="mt-4 divide-y divide-zinc-200">
              {projektyItems.map((item, idx) => (
                <div key={item.label} className={clsx("flex gap-4 py-3", idx === 0 && "pt-0")}>
                  <span className="font-mono text-lg font-bold text-orange-500">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <Body as="span" color="secondary">
                    <strong>{item.label}</strong> — {item.description}
                  </Body>
                </div>
              ))}
            </div>
          </Card>

          {/* Pricing CTA — unchanged */}
          <Card variant="inverse" className="lg:col-span-2">
            <div className="flex h-full flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <Body as="span" color="inverse" className="font-mono text-2xl font-bold">
                  cena dle domluvy
                </Body>
                <Body color="muted" className="mt-2">
                  Rozsah a podmínky dle vašich potřeb
                </Body>
              </div>
              <Button href="https://cal.com/vojtechmares/30min" variant="secondary">
                Domluvme si schůzku
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
