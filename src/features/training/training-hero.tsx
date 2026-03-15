import { Body } from "../../components/ui/body";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";
import { t, type Locale } from "../../i18n";
import { formatDuration } from "../../i18n/formatting";
import { formatPrice } from "../../i18n/formatting";

interface TrainingHeroProps {
  title: string;
  description: string;
  length: number;
  price: number;
  logo?: { src: string };
  locale: Locale;
}

export function TrainingHero({ title, description, length, price, logo, locale }: TrainingHeroProps) {
  const durationLabel = formatDuration(length, locale);
  const formattedPrice = formatPrice(price, locale);

  return (
    <Section variant="inverse" ariaLabel={t(locale, "training_hero.training_aria", { title })}>
      <Container>
        <div className="flex flex-col gap-y-8 lg:flex-row lg:justify-between lg:gap-y-0">
          <div>
            <div className="flex items-center gap-x-4">
              {logo && (
                <img
                  src={logo.src}
                  alt={`${title} logo`}
                  className={`h-20 w-auto shrink-0 ${logo.src.endsWith(".svg") ? "invert" : ""}`}
                />
              )}
              <Heading variant="inverse" level="h1">
                <span className="text-orange-500">{title}</span> {t(locale, "training_hero.training_suffix")}
              </Heading>
            </div>
            <Text variant="muted" className="mt-6 max-w-xl">
              {description}
            </Text>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">{durationLabel}</span>
              <Body color="muted" className="mt-1">
                {t(locale, "training_hero.duration_label")}
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">{formattedPrice}</span>
              <Body color="muted" className="mt-1">
                {t(locale, "training_hero.price_label")}
              </Body>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
