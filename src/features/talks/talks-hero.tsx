import { Body } from "../../components/ui/body";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";

interface TalksHeroProps {
  talkCount: number;
  eventCount: number;
  yearsOfSpeaking: number;
}

export function TalksHero({ talkCount, eventCount, yearsOfSpeaking }: TalksHeroProps) {
  return (
    <Section variant="inverse" ariaLabel="Přednášky">
      <Container>
        <div className="flex flex-col gap-y-8 lg:flex-row lg:justify-between lg:gap-y-0">
          <div>
            <Heading variant="inverse" level="h1">
              Přednášky na <span className="text-orange-500">konferencích</span>
            </Heading>
            <Text variant="muted" className="mt-6 max-w-xl">
              Pravidelně přednáším na odborných konferencích v Česku i zahraničí. Sdílím praktické zkušenosti z oblasti
              DevOps, cloud-native technologií a moderní infrastruktury.
            </Text>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-mono text-3xl font-bold text-white">{talkCount} přednášek</span>
              <Body color="muted" className="mt-1">
                na odborných konferencích
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-mono text-3xl font-bold text-white">{eventCount} konferencí</span>
              <Body color="muted" className="mt-1">
                v ČR i zahraničí
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-mono text-3xl font-bold text-white">{yearsOfSpeaking}+ roky</span>
              <Body color="muted" className="mt-1">
                zkušeností s přednášením
              </Body>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
