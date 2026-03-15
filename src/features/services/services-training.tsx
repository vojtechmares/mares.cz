import { Badge } from "../../components/ui/badge";
import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { t, type Locale } from "../../i18n";
import { localizeUrl } from "../../i18n/routes";

interface Training {
  id: string;
  title: string;
  description: string;
}

interface ServicesTrainingProps {
  trainings: Training[];
  locale: Locale;
}

export function ServicesTraining({ trainings, locale }: ServicesTrainingProps) {
  return (
    <Section id="skoleni" ariaLabel={t(locale, "services_training.heading")}>
      <Container>
        <Badge variant="accent">{t(locale, "services_training.badge")}</Badge>
        <Heading level="h2" className="mt-4">
          {t(locale, "services_training.heading")}
        </Heading>
        <Body variant="large" className="mt-4 max-w-2xl">
          {t(locale, "services_training.description")}
        </Body>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training) => (
            <a key={training.id} href={localizeUrl("/skoleni/" + training.id, locale)} className="flex h-full">
              <Card variant="surface" hover className="flex h-full flex-col">
                <Heading level="h3" className="text-lg">
                  {training.title}
                </Heading>
                <Body color="secondary" className="mt-2">
                  {training.description}
                </Body>
              </Card>
            </a>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div>
            <Heading level="h3">{t(locale, "services_training.public_sessions")}</Heading>
            <Body color="secondary" className="mt-4">
              {t(locale, "services_training.public_sessions_description")}
            </Body>
            <Button
              href={localizeUrl("/skoleni/verejne-terminy", locale)}
              style="outline"
              variant="primary"
              className="mt-6"
            >
              {t(locale, "services_training.show_sessions")}
            </Button>

            <Heading level="h3" className="mt-10">
              {t(locale, "services_training.corporate")}
            </Heading>
            <Body color="secondary" className="mt-4">
              {t(locale, "services_training.corporate_description")}
            </Body>
          </div>
          <Card variant="accent" className="flex h-full flex-col">
            <Body as="span" className="font-mono text-2xl font-bold">
              {t(locale, "services_training.price")}
            </Body>
            <Body color="secondary" className="mt-2">
              {t(locale, "services_training.price_label")}
            </Body>
            <Body as="div" color="secondary" className="mt-4">
              <ul className="list-inside list-disc space-y-1">
                <li>{t(locale, "services_training.benefit1")}</li>
                <li>{t(locale, "services_training.benefit2")}</li>
                <li>{t(locale, "services_training.benefit3")}</li>
              </ul>
            </Body>
            <div className="mt-auto pt-6">
              <Button href="#skoleni" variant="primary">
                {t(locale, "services_training.training_list")}
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
