import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";

interface SessionsHeroProps {
  sessionCount: number;
  topicCount: number;
  nextSessionDate: string | null;
}

export function SessionsHero({ sessionCount, topicCount, nextSessionDate }: SessionsHeroProps) {
  const formattedDate = nextSessionDate
    ? new Date(nextSessionDate).toLocaleDateString("cs-CZ", {
        day: "numeric",
        month: "long",
      })
    : null;

  if (sessionCount === 0) {
    return (
      <Section variant="inverse" ariaLabel="Veřejné termíny školení">
        <Container>
          <div>
            <Heading variant="inverse" level="h1">
              Veřejné <span className="text-orange-500">termíny</span> školení
            </Heading>
            <Text variant="muted" className="mt-6 max-w-xl">
              Momentálně nejsou vypsány žádné veřejné termíny. Podívejte se na nabídku školení — rádi vám připravíme
              termín na míru.
            </Text>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="medium" href="#skoleni" variant="accent">
                Všechna školení
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section variant="inverse" ariaLabel="Veřejné termíny školení">
      <Container>
        <div className="flex flex-col gap-y-8 lg:flex-row lg:justify-between lg:gap-y-0">
          <div>
            <Heading variant="inverse" level="h1">
              Veřejné <span className="text-orange-500">termíny</span> školení
            </Heading>
            <Text variant="muted" className="mt-6 max-w-xl">
              Otevřená školení pro jednotlivce i malé týmy. Přihlaste se na vypsaný termín a získejte praktické
              zkušenosti z oblasti DevOps a kontejnerů pod vedením zkušeného lektora.
            </Text>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="medium" href="#skoleni" variant="accent">
                Všechna školení
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-mono text-3xl font-bold text-white">{sessionCount} termínů</span>
              <Body color="muted" className="mt-1">
                vypsaných v nejbližších měsících
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-mono text-3xl font-bold text-white">{topicCount} témat</span>
              <Body color="muted" className="mt-1">
                z oblasti DevOps a kontejnerů
              </Body>
            </div>
            {formattedDate && (
              <div className="border-l-2 border-orange-500 pl-6">
                <span className="font-mono text-3xl font-bold text-white">{formattedDate}</span>
                <Body color="muted" className="mt-1">
                  nejbližší volný termín
                </Body>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
