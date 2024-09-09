import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";

import { trainingList, type TrainingType } from "@/content/traininig-list";

type TrainingProps = {
  training: TrainingType;
  className?: string;
};

const Training = ({ training, className }: TrainingProps) => {
  return (
    <Link href={training.href} className={className}>
      <Image
        src={training.logo.src}
        className="mx-auto rounded-lg p-2 invert"
        width="128"
        height="128"
        alt={training.name}
      />
      <h3 className="font-display mt-4 text-center text-4xl font-medium tracking-tight text-amber-500">
        {training.name}
      </h3>
    </Link>
  );
};

const TrainingGridMobile = () => {
  return (
    <div className="-mx-4 mt-20 grid grid-cols-2 gap-x-8 gap-y-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {trainingList.map((training) => (
        <div key={training.name}>
          <Training training={training} />
        </div>
      ))}
    </div>
  );
};

const TrainingGridDesktop = () => {
  return (
    <div className="hidden lg:mt-20 lg:block">
      <div className="grid grid-cols-3 gap-x-8 gap-y-4">
        {trainingList.map((training) => (
          <div
            key={training.name}
            className="relative cursor-pointer rounded-3xl py-4 transition duration-300 ease-in-out md:ring-1 md:ring-transparent md:hover:-translate-y-1 md:hover:scale-110 md:hover:ring-slate-700"
          >
            <Training training={training} />
          </div>
        ))}
      </div>
    </div>
  );
};

const TrainingList = () => {
  return (
    <section
      id="skoleni"
      aria-label="Training"
      className="bg-black pb-14 pt-20 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Školení
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-400">
            Sdílím svoje zkušenosti a znalosti z praxe formou školení. Školím
            open-source DevOps nástroje a technologie.
          </p>
        </div>
        <TrainingGridMobile />
        <TrainingGridDesktop />
      </Container>
    </section>
  );
};

export { TrainingList };
