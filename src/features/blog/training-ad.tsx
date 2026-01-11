import { Button } from "../../components/ui/button";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";
import { Container } from "../../components/ui/container";
import { getEntry } from "astro:content";

export async function TrainingAd({ trainingSlug }: { trainingSlug?: string }) {
  if (!trainingSlug) {
    return <></>;
  }

  try {
    const training = await getEntry("training", trainingSlug);

    if (training === undefined) {
      throw new Error("Training is undefined for slug: " + trainingSlug);
    }

    return (
      <Section id="skoleni" variant="inverse">
        <Container>
          <div className="flex flex-col justify-between md:flex-row">
            <div className="max-w-3xl">
              <Heading level="h2" variant="inverse">
                {training.data.title} školení
              </Heading>
              <Text variant="inverse" className="mt-4">
                {training.data.ad}
              </Text>
              <div className="flex flex-col md:flex-row md:gap-x-6">
                <Button href="mailto:vojtech@mares.cz" variant="accent" className="mt-10">
                  Nezávazně poptat firemní školení
                </Button>
                <Button href={"/skoleni/" + training.id} variant="secondary" className="mt-10">
                  Více informací o školení
                </Button>
              </div>
            </div>
            <img
              src={training.data.icon?.src as string}
              alt=""
              className="mx-auto hidden p-2 invert md:block"
              width="196"
              height="196"
            />
          </div>
        </Container>
      </Section>
    );
  } catch (error) {
    console.error("Failed to load training ad:", error);
    return <></>;
  }
}
