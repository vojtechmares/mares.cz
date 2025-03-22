import Image from "next/image";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { strapi } from "@/lib/strapi/strapi";
import { CallToAction } from "@/components/landing/call-to-action";
import { Heading } from "@/components/ui/heading";

export async function TrainingAd({ trainingSlug }: { trainingSlug?: string }) {
  if (!trainingSlug) {
    return <></>;
  }

  try {
    const training = await strapi.getTraining(trainingSlug);

    return (
      <CallToAction id="skoleni">
        <div className="flex flex-col justify-between md:flex-row">
          <div className="max-w-3xl">
            <Heading level="h2" >
              {training.title} školení
            </Heading>
            <p className="mt-4 text-lg tracking-tight text-black">
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
            className="mx-auto hidden rounded-lg p-2 md:block"
            width="196"
            height="196"
          />
        </div>
      </CallToAction>
    );
  } catch (error) {
    return <></>;
  }
}
