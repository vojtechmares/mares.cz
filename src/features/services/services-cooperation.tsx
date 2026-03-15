import clsx from "clsx";

import { Badge } from "../../components/ui/badge";
import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { t, type Locale } from "../../i18n";

const stepKeys = [
  { name: "services_cooperation.step1_name", description: "services_cooperation.step1_description" },
  { name: "services_cooperation.step2_name", description: "services_cooperation.step2_description" },
  { name: "services_cooperation.step3_name", description: "services_cooperation.step3_description" },
  { name: "services_cooperation.step4_name", description: "services_cooperation.step4_description" },
] as const;

const includesKeys = [
  "services_cooperation.includes1",
  "services_cooperation.includes2",
  "services_cooperation.includes3",
  "services_cooperation.includes4",
  "services_cooperation.includes5",
  "services_cooperation.includes6",
  "services_cooperation.includes7",
] as const;

const projectKeys = [
  { label: "services_cooperation.project1_label", description: "services_cooperation.project1_description" },
  { label: "services_cooperation.project2_label", description: "services_cooperation.project2_description" },
  { label: "services_cooperation.project3_label", description: "services_cooperation.project3_description" },
  { label: "services_cooperation.project4_label", description: "services_cooperation.project4_description" },
] as const;

export function ServicesCooperation({ locale }: { locale: Locale }) {
  const steps = stepKeys.map((s) => ({
    name: t(locale, s.name),
    description: t(locale, s.description),
  }));

  const includesItems = includesKeys.map((key) => t(locale, key));

  const projektyItems = projectKeys.map((p) => ({
    label: t(locale, p.label),
    description: t(locale, p.description),
  }));

  return (
    <Section id="spoluprace" variant="surface" ariaLabel={t(locale, "services_cooperation.heading")}>
      <Container>
        <Badge variant="accent">{t(locale, "services_cooperation.badge")}</Badge>
        <Heading level="h2" className="mt-4">
          {t(locale, "services_cooperation.heading")}
        </Heading>
        <Body variant="large" className="mt-4 max-w-2xl">
          {t(locale, "services_cooperation.description")}
        </Body>

        <nav aria-label="Kroky spolupráce" className="mt-12">
          <ol role="list" className="mx-auto max-w-3xl overflow-hidden pt-2">
            {steps.map((step, idx) => (
              <li key={step.name} className={clsx(idx !== steps.length - 1 ? "pb-10" : "", "relative")}>
                {idx !== steps.length - 1 ? (
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
            <Heading level="h3">{t(locale, "services_cooperation.includes_heading")}</Heading>
            <Body as="div" color="secondary" className="mt-4">
              <ul className="list-inside list-disc space-y-2 pl-4">
                {includesItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Body>
          </Card>

          <Card variant="surface" className="border-l-2 border-zinc-300">
            <Heading level="h3">{t(locale, "services_cooperation.suitable_heading")}</Heading>
            <Body color="secondary" className="mt-4">
              {t(locale, "services_cooperation.suitable_description")}
            </Body>
          </Card>

          <Card variant="surface">
            <Heading level="h3">{t(locale, "services_cooperation.support_heading")}</Heading>
            <Body color="secondary" className="mt-4">
              {t(locale, "services_cooperation.support_text1")}
            </Body>
            <Body color="secondary" className="mt-4">
              {t(locale, "services_cooperation.support_text2")}
            </Body>
          </Card>

          <Card variant="surface" className="border-t-4 border-zinc-900">
            <Heading level="h3">{t(locale, "services_cooperation.projects_heading")}</Heading>
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

          <Card variant="inverse" className="lg:col-span-2">
            <div className="flex h-full flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <Body as="span" color="inverse" className="font-mono text-2xl font-bold">
                  {t(locale, "services_cooperation.price")}
                </Body>
                <Body color="muted" className="mt-2">
                  {t(locale, "services_cooperation.price_label")}
                </Body>
              </div>
              <Button href="https://cal.com/vojtechmares/30min" variant="secondary">
                {t(locale, "nav.schedule_meeting")}
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
