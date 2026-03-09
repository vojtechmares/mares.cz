import { Badge } from "../../components/ui/badge";
import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";

interface Training {
  id: string;
  title: string;
  description: string;
}

interface ServicesTrainingProps {
  trainings: Training[];
}

export function ServicesTraining({ trainings }: ServicesTrainingProps) {
  return (
    <Section id="skoleni" ariaLabel="Školení">
      <Container>
        <Badge variant="accent">Workshopy a školení</Badge>
        <Heading level="h2" className="mt-4">
          Školení
        </Heading>
        <Body variant="large" className="mt-4 max-w-2xl">
          Školení probíhají formou workshopu s důrazem na praktické příklady. Veškeré materiály a ukázkové příklady
          účastníkům zůstanou.
        </Body>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training) => (
            <a key={training.id} href={"/skoleni/" + training.id} className="flex h-full">
              <Card variant="surface" hover className="flex h-full flex-col">
                <Heading level="h3" className="text-lg">
                  {training.title}
                </Heading>
                <Body color="secondary" className="mt-2">
                  {training.description}
                </Body>
              </Card>
            </a>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div>
            <Heading level="h3">Veřejné termíny</Heading>
            <Body color="secondary" className="mt-4">
              Pravidelně vypisuji veřejné termíny školení pro jednotlivce i malé skupiny. Školení probíhají v Praze nebo
              online.
            </Body>
            <Button href="/skoleni/verejne-terminy" style="outline" variant="primary" className="mt-6">
              Zobrazit termíny
            </Button>

            <Heading level="h3" className="mt-10">
              Firemní školení
            </Heading>
            <Body color="secondary" className="mt-4">
              Školení připravím na míru vašemu týmu — obsah, tempo i termín přizpůsobím vašim potřebám. Firemní školení
              probíhají u vás, v pronajatých prostorách nebo online.
            </Body>
          </div>
          <Card variant="accent" className="flex h-full flex-col">
            <Body as="span" className="font-mono text-2xl font-bold">
              od 5 400 CZK
            </Body>
            <Body color="secondary" className="mt-2">
              Cena za osobu na veřejném termínu
            </Body>
            <Body as="div" color="secondary" className="mt-4">
              <ul className="list-inside list-disc space-y-1">
                <li>Hands-on workshop s praktickými cvičeními</li>
                <li>Materiály a příklady k dispozici</li>
                <li>Malé skupiny pro individuální přístup</li>
              </ul>
            </Body>
            <div className="mt-auto pt-6">
              <Button href="/skoleni/" variant="primary">
                Seznam školení
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
