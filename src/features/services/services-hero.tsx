import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";
import { t, type Locale } from "../../i18n";

interface ServicesHeroProps {
  trainingCount: number;
  locale: Locale;
}

export function ServicesHero({ trainingCount, locale }: ServicesHeroProps) {
  return (
    <Section variant="inverse" ariaLabel={t(locale, "services.heading")}>
      <Container>
        <div className="flex flex-col gap-y-8 lg:flex-row lg:justify-between lg:gap-y-0">
          <div>
            <Heading variant="inverse" level="h1">
              {t(locale, "services_hero.heading")}{" "}
              <span className="text-orange-500">{t(locale, "services_hero.heading_accent")}</span>
            </Heading>
            <Text variant="muted" className="mt-6 max-w-xl">
              {t(locale, "services_hero.description")}
            </Text>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="medium" href="#spoluprace" variant="accent">
                {t(locale, "services_hero.btn_cooperation")}
              </Button>
              <Button size="medium" href="#skoleni" variant="accent">
                {t(locale, "services_hero.btn_training")}
              </Button>
              <Button size="medium" href="#konzultace" variant="accent">
                {t(locale, "services_hero.btn_consultation")}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">
                {new Date().getFullYear() - 2020}+ {t(locale, "services_hero.years_suffix")}
              </span>
              <Body color="muted" className="mt-1">
                {t(locale, "services_hero.years_label")}
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">{t(locale, "services_hero.projects")}</span>
              <Body color="muted" className="mt-1">
                {t(locale, "services_hero.projects_label")}
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">
                {t(locale, "services_hero.training_count", { count: trainingCount })}
              </span>
              <Body color="muted" className="mt-1">
                {t(locale, "services_hero.training_count_label")}
              </Body>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
