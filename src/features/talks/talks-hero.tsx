import { Body } from "../../components/ui/body";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";
import { t, type Locale } from "../../i18n";

interface TalksHeroProps {
  talkCount: number;
  eventCount: number;
  yearsOfSpeaking: number;
  locale: Locale;
}

export function TalksHero({ talkCount, eventCount, yearsOfSpeaking, locale }: TalksHeroProps) {
  return (
    <Section variant="inverse" ariaLabel={t(locale, "talks.heading")}>
      <Container>
        <div className="flex flex-col gap-y-8 lg:flex-row lg:justify-between lg:gap-y-0">
          <div>
            <Heading variant="inverse" level="h1">
              {t(locale, "talks.heading")} <span className="text-orange-500">{t(locale, "talks.heading_accent")}</span>
            </Heading>
            <Text variant="muted" className="mt-6 max-w-xl">
              {t(locale, "talks.description")}
            </Text>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">
                {t(locale, "talks.talk_count", { count: talkCount })}
              </span>
              <Body color="muted" className="mt-1">
                {t(locale, "talks.talk_count_label")}
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">
                {t(locale, "talks.event_count", { count: eventCount })}
              </span>
              <Body color="muted" className="mt-1">
                {t(locale, "talks.event_count_label")}
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">
                {t(locale, "talks.years_count", { count: yearsOfSpeaking })}
              </span>
              <Body color="muted" className="mt-1">
                {t(locale, "talks.years_count_label")}
              </Body>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
