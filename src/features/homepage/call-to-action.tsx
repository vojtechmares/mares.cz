import { Button } from "../../components/ui/button";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";
import { t, type Locale } from "../../i18n";

export function CallToAction({ locale }: { locale: Locale }) {
  return (
    <Section id="pojdme-do-toho" variant="inverse">
      <div className="mx-auto max-w-2xl text-center">
        <Heading level="h2" variant="inverse">
          {t(locale, "cta.heading")}
        </Heading>
        <Text variant="inverse" className="mt-4">
          {t(locale, "cta.description")}
        </Text>
        <Button href="https://cal.com/vojtechmares/30min" variant="accent" className="mt-10">
          {t(locale, "nav.schedule_meeting")}
        </Button>
      </div>
    </Section>
  );
}
