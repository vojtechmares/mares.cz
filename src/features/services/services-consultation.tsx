import { Badge } from "../../components/ui/badge";
import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { t, type Locale } from "../../i18n";

const areaKeys = [
  { name: "services_consultation.area1_name", description: "services_consultation.area1_description" },
  { name: "services_consultation.area2_name", description: "services_consultation.area2_description" },
  { name: "services_consultation.area3_name", description: "services_consultation.area3_description" },
  { name: "services_consultation.area4_name", description: "services_consultation.area4_description" },
] as const;

export function ServicesConsultation({ locale }: { locale: Locale }) {
  const areas = areaKeys.map((a) => ({
    name: t(locale, a.name),
    description: t(locale, a.description),
  }));

  return (
    <Section id="konzultace" variant="inverse" ariaLabel={t(locale, "services_consultation.heading")}>
      <Container>
        <div className="border-l-4 border-orange-500 pl-8 md:pl-12">
          <Badge variant="accent">{t(locale, "services_consultation.badge")}</Badge>
          <Heading level="h2" variant="inverse" className="mt-4">
            {t(locale, "services_consultation.heading")}
          </Heading>
          <Body variant="large" color="muted" className="mt-4 max-w-2xl">
            {t(locale, "services_consultation.description")}
          </Body>

          <div className="mt-12 flex flex-col gap-8">
            <div className="flex items-start gap-6">
              <span className="font-mono text-3xl font-bold text-orange-500">01</span>
              <div>
                <Body color="inverse" className="text-xl font-semibold">
                  {t(locale, "services_consultation.step1_name")}
                </Body>
                <Body color="muted" className="mt-1">
                  {t(locale, "services_consultation.step1_description")}
                </Body>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <span className="font-mono text-3xl font-bold text-orange-500">02</span>
              <div>
                <Body color="inverse" className="text-xl font-semibold">
                  {t(locale, "services_consultation.step2_name")}
                </Body>
                <Body color="muted" className="mt-1">
                  {t(locale, "services_consultation.step2_description")}
                </Body>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <span className="font-mono text-3xl font-bold text-orange-500">03</span>
              <div>
                <Body color="inverse" className="text-xl font-semibold">
                  {t(locale, "services_consultation.step3_name")}
                </Body>
                <Body color="muted" className="mt-1">
                  {t(locale, "services_consultation.step3_description")}
                </Body>
              </div>
            </div>
          </div>

          <Heading level="h3" variant="inverse" className="mt-16">
            {t(locale, "services_consultation.areas_heading")}
          </Heading>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {areas.map((area) => (
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
            {t(locale, "services_consultation.price")}
          </Body>
          <Body color="secondary" className="mt-2">
            {t(locale, "services_consultation.scope")}
          </Body>
          <div className="mt-6">
            <Button href="https://cal.com/vojtechmares/30min" variant="primary">
              {t(locale, "nav.schedule_meeting")}
            </Button>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
