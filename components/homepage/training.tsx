import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { strapi } from "@/lib/strapi/strapi";
import type { Training as TrainingType } from "@/lib/strapi/types/training";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";

type TrainingProps = {
  training: TrainingType;
  className?: string;
};

const Training = ({ training, className }: TrainingProps) => {
  return (
    <Link href={"/skoleni/" + training.slug} className={className}>
      <Image
        src={training.icon?.url as string}
        className="mx-auto rounded-lg p-2 invert"
        width="128"
        height="128"
        alt={training.title}
      />
      <Heading level="h3" className="mt-4 text-center underline" text="amber">
        {training.title}
      </Heading>
    </Link>
  );
};

type TrainingGridProps = {
  trainings: TrainingType[];
};

const TrainingGridMobile = ({ trainings }: TrainingGridProps) => {
  return (
    <div className="-mx-4 mt-20 grid grid-cols-2 gap-x-8 gap-y-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {trainings.map((training) => (
        <div key={training.slug}>
          <Training training={training} />
        </div>
      ))}
    </div>
  );
};

const TrainingGridDesktop = ({ trainings }: TrainingGridProps) => {
  return (
    <div className="hidden lg:mt-20 lg:block">
      <div className="grid grid-cols-3 gap-x-8 gap-y-4">
        {trainings.map((training) => (
          <div key={training.slug} className="rounded-3xl py-4">
            <Training training={training} />
          </div>
        ))}
      </div>
    </div>
  );
};

export function TrainingList({ trainings }: { trainings: TrainingType[] }) {
  return (
    <Section id="skoleni" aria-label="Training" background="black">
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <Heading level="h2" text="white">
            DevOps školení
          </Heading>
          <p className="mt-4 text-lg tracking-tight text-slate-300">
            Sdílím svoje zkušenosti a znalosti z praxe formou školení. Školím
            open-source DevOps nástroje a technologie.
          </p>
        </div>
        <TrainingGridMobile trainings={trainings} />
        <TrainingGridDesktop trainings={trainings} />
      </Container>
    </Section>
  );
}
