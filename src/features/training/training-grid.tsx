import type { CollectionEntry } from "astro:content";
import { clsx } from "clsx";

import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";
import { t, type Locale } from "../../i18n";
import { formatDuration, formatNumber } from "../../i18n/formatting";
import { localizeUrl } from "../../i18n/routes";
import { getLocalizedCollection, bareSlug } from "../../lib/content";

// Truncate description to keep cards clean
const truncateText = (text: string, maxLength = 240) =>
  text.length > maxLength ? text.slice(0, maxLength).trim() + "…" : text;

type TrainingCardProps = {
  training: CollectionEntry<"training">;
  locale: Locale;
  className?: string;
};

const TrainingCard = ({ training, locale, className }: TrainingCardProps) => {
  const featured = training.data.featured;
  const price = training.data.price.open[0];

  return (
    <Card
      variant={featured ? "accent" : "inverse"}
      className={clsx(className, "group flex h-full flex-col")}
      hover={true}
    >
      {/* Header row: Icon + Title/Price */}
      <div className="flex flex-row items-start justify-between gap-6">
        {/* Icon */}
        <div className="shrink-0">
          <img
            src={training.data.icon?.src as string}
            className={clsx("transition-transform duration-200 ease-out group-hover:scale-105", !featured && "invert")}
            width="80"
            height="80"
            alt={`Ikona školení ${training.data.title}`}
            loading="lazy"
          />
        </div>

        {/* Title + Metadata */}
        <div className="flex grow flex-col items-end text-right">
          <Heading level="h3" variant={featured ? "primary" : "inverse"}>
            {training.data.title}
          </Heading>

          {/* Duration */}
          <Body
            as="span"
            color={featured ? "primary" : "muted"}
            className="mt-2 font-mono text-sm tracking-wider uppercase"
          >
            {formatDuration(training.data.length, locale)}
          </Body>

          {/* Price */}
          <Body as="span" color={featured ? "primary" : "inverse"} className="mt-1 font-mono text-lg font-bold">
            {t(locale, "training_grid.price_from")} {formatNumber(price.amount, locale)} {price.currency}
          </Body>
        </div>
      </div>

      {/* Description - full width */}
      <Body color={featured ? "primary" : "muted"} className="mt-4 leading-relaxed">
        {truncateText(training.data.description)}
      </Body>

      {/* CTA Button */}
      <div className="mt-auto flex justify-end pt-4">
        <Button
          href={localizeUrl("/skoleni/" + bareSlug(training.id), locale)}
          variant={featured ? "primary" : "accent"}
        >
          {t(locale, "training_grid.about")}
        </Button>
      </div>
    </Card>
  );
};

export async function TrainingGrid({ locale }: { locale: Locale }) {
  const trainings = await getLocalizedCollection("training", locale, ({ data }) => {
    return !data.draft;
  });

  trainings.sort((a, b) => Number(b.data.featured) - Number(a.data.featured));

  return (
    <Section id={locale === "en" ? "training" : "skoleni"} aria-label="Training" variant="inverse">
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <Heading level="h2" variant="inverse">
            {t(locale, "training_grid.heading")}
          </Heading>
          <Text variant="muted" className="mt-4 tracking-tight">
            {t(locale, "training_grid.subheading")}
          </Text>
        </div>

        {/* Responsive grid: 1 col mobile, 3 cols desktop */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {trainings.map((training) => (
            <TrainingCard key={training.id} training={training} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
