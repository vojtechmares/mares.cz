import { Container } from "../../components/ui/container";
import type { Training as TrainingType } from "../../interfaces/training";
import { Section } from "../../components/ui/section";
import { Heading } from "../../components/ui/heading";
import { Card } from "../../components/ui/card";
import { clsx } from "clsx";
import { Button } from "../../components/ui/button";

type TrainingProps = {
  training: TrainingType;
  className?: string;
  featured: boolean;
};

const Training = ({ training, className, featured = false }: TrainingProps) => {
  return (
    <div className={clsx(className, "flex flex-row items-center justify-between")}>
      <img
        src={training.icon?.url as string}
        className={clsx("", featured ? "" : "invert")}
        width="80"
        height="80"
        alt={`Ikona školení ${training.title}`}
        loading="lazy"
      />
      <div className="flex flex-col items-end">
        <Heading level="h3" variant={featured ? "primary" : "inverse"} className="text-right">
          {training.title}
        </Heading>
        <Button
          className="mt-4"
          href={"/skoleni/" + training.slug}
          variant={featured ? "primary" : "accent"}
        >
          O školení
        </Button>
      </div>
    </div>
  );
};

type TrainingGridProps = {
  trainings: TrainingType[];
};

const TrainingGridMobile = ({ trainings }: TrainingGridProps) => {
  return (
    <div className="-mx-4 mt-10 grid grid-cols-1 gap-x-8 gap-y-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {trainings.map((training) => (
        <Card variant={training.slug === "kubernetes" ? "accent" : "inverse"} key={training.slug}>
          <Training training={training} featured={training.slug === "kubernetes"} />
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
          <Card variant={training.slug === "kubernetes" ? "accent" : "inverse"} key={training.slug}>
            <Training training={training} featured={training.slug === "kubernetes"} />
          </Card>
        ))}
      </div>
    </div>
  );
};

export function TrainingList({ trainings }: { trainings: TrainingType[] }) {
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
