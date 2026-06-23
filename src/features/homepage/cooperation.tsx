import clsx from "clsx";

import { Body } from "../../components/ui/body";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";
import { t, type Locale } from "../../i18n";

const stepKeys = [
  { name: "cooperation.step1_name", description: "cooperation.step1_description" },
  { name: "cooperation.step2_name", description: "cooperation.step2_description" },
  { name: "cooperation.step3_name", description: "cooperation.step3_description" },
  { name: "cooperation.step4_name", description: "cooperation.step4_description" },
  { name: "cooperation.step5_name", description: "cooperation.step5_description" },
] as const;

export function Cooperation({ locale }: { locale: Locale }) {
  const steps = stepKeys.map((s) => ({
    name: t(locale, s.name),
    description: t(locale, s.description),
  }));

  return (
    <Section id="z-nuly-do-cloudu" aria-label={t(locale, "cooperation.heading")} variant="inverse">
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <Heading level="h2" variant="inverse">
            {t(locale, "cooperation.heading")}
          </Heading>
          <Text variant="muted" className="mt-4 tracking-tight">
            {t(locale, "cooperation.subheading")}
          </Text>
        </div>
        <nav aria-label="Progress">
          <ol className="mx-auto mt-10 max-w-3xl overflow-hidden pt-2">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={clsx(stepIdx !== steps.length - 1 ? "pb-10" : "", "relative")}>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute top-4 left-6 mt-0.5 -ml-px h-full w-0.5 bg-white" aria-hidden="true" />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center border-2 border-orange-500 bg-white">
                      <span className="h-3 w-3 bg-neutral-900" />
                    </span>
                  </span>
                  <Body as="span" className="ml-4 flex min-w-0 flex-col">
                    <Body as="span" color="inverse" className="text-2xl font-normal">
                      {step.name}
                    </Body>
                    <Body as="span" color="muted" variant="large">
                      {step.description}
                    </Body>
                  </Body>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </Section>
  );
}
