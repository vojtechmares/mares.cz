import { type CollectionEntry, getCollection } from "astro:content";
import { clsx } from "clsx";

import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";

// Price formatter (Czech locale - space as thousands separator)
const formatPrice = (amount: number) => new Intl.NumberFormat("cs-CZ").format(amount);

// Duration text (Czech grammar)
const getDurationText = (days: number) => (days === 1 ? "1 den" : `${days} dny`);

// Truncate description to keep cards clean
const truncateText = (text: string, maxLength = 240) =>
  text.length > maxLength ? text.slice(0, maxLength).trim() + "…" : text;

type TrainingCardProps = {
  training: CollectionEntry<"training">;
  className?: string;
};

const TrainingCard = ({ training, className }: TrainingCardProps) => {
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
            {getDurationText(training.data.length)}
          </Body>

          {/* Price */}
          <Body as="span" color={featured ? "primary" : "inverse"} className="mt-1 font-mono text-lg font-bold">
            od {formatPrice(price.amount)} {price.currency}
          </Body>
        </div>
      </div>

      {/* Description - full width */}
      <Text variant={featured ? "primary" : "muted"} className="mt-4 leading-relaxed">
        {truncateText(training.data.description)}
      </Text>

      {/* CTA Button */}
      <div className="mt-auto flex justify-end pt-4">
        <Button href={"/skoleni/" + training.id} variant={featured ? "primary" : "accent"}>
          O školení
        </Button>
      </div>
    </Card>
  );
};

export async function TrainingGrid() {
  const trainings = await getCollection("training", ({ data }) => {
    return !data.draft;
  });

  return (
    <Section id="skoleni" aria-label="Training" variant="inverse">
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <Heading level="h2" variant="inverse">
            DevOps školení
          </Heading>
          <Text variant="muted" className="mt-4 tracking-tight">
            Sdílím své zkušenosti a znalosti z každodenní praxe formou školení a workshopů. Zaměřuji se především na
            open-source DevOps nástroje a technologie.
          </Text>
        </div>

        {/* Responsive grid: 1 col mobile, 3 cols desktop */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {trainings.map((training) => (
            <TrainingCard key={training.id} training={training} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
