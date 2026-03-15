import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";
import { t, type Locale } from "../../i18n";
import { formatSessionCount, formatDate } from "../../i18n/formatting";

interface SessionsHeroProps {
  sessionCount: number;
  topicCount: number;
  nextSessionDate: string | null;
  locale: Locale;
}

export function SessionsHero({ sessionCount, topicCount, nextSessionDate, locale }: SessionsHeroProps) {
  const formattedDate = nextSessionDate ? formatDate(nextSessionDate, locale, { day: "numeric", month: "long" }) : null;

  if (sessionCount === 0) {
    return (
      <Section variant="inverse" ariaLabel={t(locale, "sessions_hero.aria_label")}>
        <Container>
          <div>
            <Heading variant="inverse" level="h1">
              {t(locale, "sessions_hero.heading_public")}{" "}
              <span className="text-orange-500">{t(locale, "sessions_hero.heading_sessions")}</span>{" "}
              {t(locale, "sessions_hero.heading_training")}
            </Heading>
            <Text variant="muted" className="mt-6 max-w-xl">
              {t(locale, "sessions_hero.no_sessions_text")}
            </Text>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="medium" href="#skoleni" variant="accent">
                {t(locale, "sessions_hero.all_trainings")}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section variant="inverse" ariaLabel={t(locale, "sessions_hero.aria_label")}>
      <Container>
        <div className="flex flex-col gap-y-8 lg:flex-row lg:justify-between lg:gap-y-0">
          <div>
            <Heading variant="inverse" level="h1">
              {t(locale, "sessions_hero.heading_public")}{" "}
              <span className="text-orange-500">{t(locale, "sessions_hero.heading_sessions")}</span>{" "}
              {t(locale, "sessions_hero.heading_training")}
            </Heading>
            <Text variant="muted" className="mt-6 max-w-xl">
              {t(locale, "sessions_hero.description")}
            </Text>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="medium" href="#skoleni" variant="accent">
                {t(locale, "sessions_hero.all_trainings")}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">
                {formatSessionCount(sessionCount, locale)}
              </span>
              <Body color="muted" className="mt-1">
                {t(locale, "sessions_hero.sessions_upcoming")}
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">
                {topicCount} {t(locale, "sessions_hero.topics_suffix")}
              </span>
              <Body color="muted" className="mt-1">
                {t(locale, "sessions_hero.topics_label")}
              </Body>
            </div>
            {formattedDate && (
              <div className="border-l-2 border-orange-500 pl-6">
                <span className="font-sans text-3xl font-bold text-white">{formattedDate}</span>
                <Body color="muted" className="mt-1">
                  {t(locale, "sessions_hero.next_session")}
                </Body>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
