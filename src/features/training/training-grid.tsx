import { type CollectionEntry, getCollection } from "astro:content";

import { Container } from "../../components/ui/container";
import { Section } from "../../components/ui/section";
import { Heading } from "../../components/ui/heading";
import { Card } from "../../components/ui/card";
import { clsx } from "clsx";
import { Button } from "../../components/ui/button";

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
            className={clsx(
              "transition-transform duration-200 ease-out group-hover:scale-105",
              !featured && "invert",
            )}
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
          <span
            className={clsx(
              "mt-2 font-mono text-sm uppercase tracking-wider",
              featured ? "text-zinc-700" : "text-zinc-400",
            )}
          >
            {getDurationText(training.data.length)}
          </span>

          {/* Price */}
          <span
            className={clsx(
              "mt-1 font-mono text-lg font-bold",
              featured ? "text-zinc-900" : "text-zinc-100",
            )}
          >
            od {formatPrice(price.amount)} {price.currency}
          </span>
        </div>
      </div>

      {/* Description - full width */}
      <p className={clsx("mt-4 leading-relaxed", featured ? "text-zinc-800" : "text-zinc-400")}>
        {truncateText(training.data.description)}
      </p>

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

  // Sort trainings: featured first
  const sortedTrainings = [...trainings].sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return 0;
  });

  return (
    <Section id="skoleni" aria-label="Training" variant="inverse">
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <Heading level="h2" variant="inverse">
            DevOps školení
          </Heading>
          <p className="mt-4 text-lg tracking-tight text-zinc-300">
            Sdílím své zkušenosti a znalosti z každodenní praxe formou školení a workshopů. Zaměřuji
            se především na open-source DevOps nástroje a technologie.
          </p>
        </div>

        {/* Responsive grid: 1 col mobile, 3 cols desktop */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {sortedTrainings.map((training) => (
            <TrainingCard key={training.id} training={training} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
