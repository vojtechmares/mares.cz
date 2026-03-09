import { Badge } from "../../components/ui/badge";
import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";

const consultationAreas = [
  { name: "Revize infrastruktury", description: "Audit současného stavu a doporučení" },
  { name: "Výběr technologií", description: "Porovnání nástrojů a platforem" },
  { name: "CI/CD pipeline", description: "Návrh nebo optimalizace build procesů" },
  { name: "Optimalizace nákladů", description: "Rychlá analýza nákladů a návrh úspor" },
];

export function ServicesConsultation() {
  return (
    <Section id="konzultace" variant="inverse" ariaLabel="Konzultace">
      <Container>
        <div className="border-l-4 border-orange-500 pl-8 md:pl-12">
          <Badge variant="accent">Jednorázová spolupráce</Badge>
          <Heading level="h2" variant="inverse" className="mt-4">
            Konzultace
          </Heading>
          <Body variant="large" color="muted" className="mt-4 max-w-2xl">
            Potřebujete expertní pohled na vaši infrastrukturu, ale nehledáte dlouhodobý závazek? Konzultace jsou
            ideální pro jednorázové úkoly, audity nebo strategické rozhodování v rozsahu do 2 člověkodnů.
          </Body>

          <div className="mt-12 flex flex-col gap-8">
            <div className="flex items-start gap-6">
              <span className="font-mono text-3xl font-bold text-orange-500">01</span>
              <div>
                <Body color="inverse" className="text-xl font-semibold">
                  Úvodní schůzka
                </Body>
                <Body color="muted" className="mt-1">
                  30 minut zdarma — probereme váš problém a domluvíme se na dalším postupu.
                </Body>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <span className="font-mono text-3xl font-bold text-orange-500">02</span>
              <div>
                <Body color="inverse" className="text-xl font-semibold">
                  Analýza a audit
                </Body>
                <Body color="muted" className="mt-1">
                  Projdu vaši infrastrukturu, kód nebo procesy a připravím detailní zprávu.
                </Body>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <span className="font-mono text-3xl font-bold text-orange-500">03</span>
              <div>
                <Body color="inverse" className="text-xl font-semibold">
                  Doporučení a akční plán
                </Body>
                <Body color="muted" className="mt-1">
                  Dostanete konkrétní kroky s prioritami, které můžete ihned implementovat.
                </Body>
              </div>
            </div>
          </div>

          <Heading level="h3" variant="inverse" className="mt-16">
            Typické oblasti konzultací
          </Heading>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {consultationAreas.map((area) => (
              <Card key={area.name} variant="surface">
                <Heading level="h4" className="text-base">
                  {area.name}
                </Heading>
                <Body color="secondary" variant="small" className="mt-1">
                  {area.description}
                </Body>
              </Card>
            ))}
          </div>
        </div>

        <Card variant="accent" className="mx-auto mt-12 max-w-lg text-center">
          <Body as="span" className="font-mono text-2xl font-bold">
            2 500 CZK / hod
          </Body>
          <Body color="secondary" className="mt-2">
            Rozsah do 2 člověkodnů
          </Body>
          <div className="mt-6">
            <Button href="https://cal.com/vojtechmares/30min" variant="primary">
              Domluvme si schůzku
            </Button>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
