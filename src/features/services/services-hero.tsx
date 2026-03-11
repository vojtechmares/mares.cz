import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";

interface ServicesHeroProps {
  trainingCount: number;
}

export function ServicesHero({ trainingCount }: ServicesHeroProps) {
  return (
    <Section variant="inverse" ariaLabel="Služby">
      <Container>
        <div className="flex flex-col gap-y-8 lg:flex-row lg:justify-between lg:gap-y-0">
          <div>
            <Heading variant="inverse" level="h1">
              DevOps služby na <span className="text-orange-500">míru</span>
            </Heading>
            <Text variant="muted" className="mt-6 max-w-xl">
              Pomáhám firmám budovat a spravovat moderní infrastrukturu. Od jednorázové konzultace přes hands-on školení
              až po dlouhodobé partnerství — vždy s důrazem na automatizaci, bezpečnost a předávání know-how vašemu
              týmu.
            </Text>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="medium" href="#spoluprace" variant="accent">
                Spolupráce
              </Button>
              <Button size="medium" href="#skoleni" variant="accent">
                Školení
              </Button>
              <Button size="medium" href="#konzultace" variant="accent">
                Konzultace
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">{new Date().getFullYear() - 2020}+ let</span>
              <Body color="muted" className="mt-1">
                praxe v DevOps a cloudové infrastruktuře
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">20+ projektů</span>
              <Body color="muted" className="mt-1">
                úspěšně dokončených napříč obory
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">{trainingCount} školení</span>
              <Body color="muted" className="mt-1">
                pravidelně vypisovaných témat
              </Body>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
