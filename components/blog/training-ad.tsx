import Image from "next/image";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { strapi } from "@/lib/strapi/strapi";

export async function TrainingAd({ trainingSlug }: { trainingSlug?: string }) {
  if (!trainingSlug) {
    return <></>;
  }

  try {
    const training = await strapi.getTraining(trainingSlug);

    return (
      <section className="bg-amber-500 pb-28 pt-20 sm:py-32">
        <Container>
          <div className="flex flex-col justify-between md:flex-row">
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {training.title} školení
              </h2>
              <p className="mt-4 text-lg tracking-tight text-white">
                {training.adText}
              </p>
              <div className="flex flex-col md:flex-row md:gap-x-6">
                <Button
                  href="mailto:vojtech@mares.cz"
                  color="black"
                  size="large"
                  className="mt-10"
                >
                  Nezávazně poptat firemní školení
                </Button>
                <Button
                  href={"/skoleni/" + training.slug}
                  color="white"
                  size="large"
                  className="mt-10"
                >
                  Více informací o školení
                </Button>
              </div>
            </div>
            <Image
              src={training.icon?.url as string}
              alt=""
              className="mx-auto hidden rounded-lg p-2 invert md:block"
              width="196"
              height="196"
            />
          </div>
        </Container>
      </section>
    );
  } catch (error) {
    return <></>;
  }
}
