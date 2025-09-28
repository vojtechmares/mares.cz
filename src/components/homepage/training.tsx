import { Container } from "../ui/container";
import type { Training as TrainingType } from "../../interfaces/training";
import { Section } from "../ui/section";
import { Heading } from "../ui/heading";

type TrainingProps = {
    training: TrainingType;
    className?: string;
};

const Training = ({ training, className }: TrainingProps) => {
    return (
        <a href={"/skoleni/" + training.slug} className={className}>
            <img
                src={training.icon?.url as string}
                className="mx-auto rounded-lg p-2 invert"
                width="128"
                height="128"
                alt={`Ikona školení ${training.title}`}
                loading="lazy"
            />
            <Heading
                level="h3"
                className="mt-4 text-center underline"
                text="amber"
            >
                {training.title}
            </Heading>
        </a>
    );
};

type TrainingGridProps = {
    trainings: TrainingType[];
};

const TrainingGridMobile = ({ trainings }: TrainingGridProps) => {
    return (
        <div className="-mx-4 mt-10 grid grid-cols-2 gap-x-8 gap-y-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
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
        <div className="mt-10 hidden lg:block">
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
                        Sdílím své zkušenosti a znalosti z každodenní praxe
                        formou školení a workshopů. Zaměřuji se především na
                        open-source DevOps nástroje a technologie.
                    </p>
                </div>
                <TrainingGridMobile trainings={trainings} />
                <TrainingGridDesktop trainings={trainings} />
            </Container>
        </Section>
    );
}
