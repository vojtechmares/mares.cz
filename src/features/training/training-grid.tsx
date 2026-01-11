import { type CollectionEntry, getCollection } from "astro:content";

import { Container } from "../../components/ui/container";
import { Section } from "../../components/ui/section";
import { Heading } from "../../components/ui/heading";
import { Card } from "../../components/ui/card";
import { clsx } from "clsx";
import { Button } from "../../components/ui/button";

type TrainingCardProps = {
  training: CollectionEntry<"training">;
  className?: string;
  featured: boolean;
};

const TrainingCard = ({ training, className, featured = false }: TrainingCardProps) => {
  return (
    <div className={clsx(className, "flex flex-row items-center justify-between")}>
      <img
        src={training.data.icon?.src as string}
        className={clsx("", featured ? "" : "invert")}
        width="80"
        height="80"
        alt={`Ikona školení ${training.data.title}`}
        loading="lazy"
      />
      <div className="flex flex-col items-end">
        <Heading level="h3" variant={featured ? "primary" : "inverse"} className="text-right">
          {training.data.title}
        </Heading>
        <Button
          className="mt-4"
          href={"/skoleni/" + training.id}
          variant={featured ? "primary" : "accent"}
        >
          O školení
        </Button>
      </div>
    </div>
  );
};

type TrainingGridProps = {
  trainings: CollectionEntry<"training">[];
};

const TrainingGridMobile = ({ trainings }: TrainingGridProps) => {
  return (
    <div className="-mx-4 mt-10 grid grid-cols-1 gap-x-8 gap-y-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {trainings.map((training) => (
        <Card variant={training.id === "kubernetes" ? "accent" : "inverse"} key={training.id}>
          <TrainingCard training={training} featured={training.id === "kubernetes"} />
        </Card>
      ))}
    </div>
  );
};

const TrainingGridDesktop = ({ trainings }: TrainingGridProps) => {
  return (
    <div className="mt-10 hidden lg:block">
      <div className="grid grid-cols-3 gap-x-8 gap-y-4">
        {trainings.map((training) => (
          <Card variant={training.id === "kubernetes" ? "accent" : "inverse"} key={training.id}>
            <TrainingCard training={training} featured={training.id === "kubernetes"} />
          </Card>
        ))}
      </div>
    </div>
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
          <p className="mt-4 text-lg tracking-tight text-zinc-300">
            Sdílím své zkušenosti a znalosti z každodenní praxe formou školení a workshopů. Zaměřuji
            se především na open-source DevOps nástroje a technologie.
          </p>
        </div>
        <TrainingGridMobile trainings={trainings} />
        <TrainingGridDesktop trainings={trainings} />
      </Container>
    </Section>
  );
}
