import clsx from "clsx";

import { Button } from "../../components/ui/button";
import { Container } from "../../components/ui/container";
import { Section } from "../../components/ui/section";
import { Heading } from "../../components/ui/heading";
import { Card } from "../../components/ui/card";
import { Text } from "../../components/ui/text";

type ServiceProps = {
  name: string;
  description: string;
  href: string;
  featured?: boolean;
  buttonText: string;
  buttonAriaLabel?: string;
};

function Service({
  name,
  description,
  href,
  featured = false,
  buttonText,
  buttonAriaLabel,
}: ServiceProps) {
  return (
    <Card
      variant={featured ? "accent" : "inverse"}
      className={featured ? "order-first lg:order-0" : ""}
      hover={true}
    >
      <Heading level="h3" variant={featured ? "primary" : "inverse"}>
        {name}
      </Heading>
      <Text variant={featured ? "primary" : "muted"} className={clsx("mt-4 text-base")}>
        {description}
      </Text>
      <Button
        href={href}
        style="solid"
        variant={featured ? "primary" : "secondary"}
        className="mt-6"
        aria-label={buttonAriaLabel}
      >
        {buttonText}
      </Button>
    </Card>
  );
}

export function Services() {
  return (
    <Section id="sluzby" aria-label="Služby" variant="inverse">
      <Container>
        <div className="md:text-center">
          <Heading level="h2" variant="inverse">
            Služby
          </Heading>
          <p className="mt-4 text-lg text-zinc-300">
            Co dělám a jak vám mohu pomoci rozvinout vaši IT infrastrukturu?
          </p>
        </div>
        <div className="mt-10 grid max-h-none max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:mx-0">
          <Service
            name="Konzultace"
            description="Potřebujete poradit nebo si nevíte rady? Společně projdeme váš současný stav, identifikujeme problémy a navrhneme vhodná řešení."
            buttonText="Napište mi"
            buttonAriaLabel="Napište mi email a domluvme si konzultaci"
            href="mailto:vojtech@mares.cz"
          />
          <Service
            featured
            name="Školení"
            description="Formou workshopu seznámím váš tým s moderními cloudovými technologiemi a naučím vás je efektivně využívat. Vše si společně vyzkoušíme na praktických příkladech. Veškeré materiály ze školení a ukázkové příklady vám zůstanou."
            href="/#skoleni"
            buttonText="Seznam školení"
            buttonAriaLabel="Odkaz na seznam školení"
          />
          <Service
            name="DevOps spolupráce"
            description="Nabízím dlouhodobou spolupráci, při které se kompletně postarám o vaši infrastrukturu, pravidelné aktualizace a požadavky vašich aplikací. Společně budeme rozvíjet vaši platformu tak, aby odpovídala vašim aktuálním potřebám."
            href="/sluzby"
            buttonText="Všechny služby"
            buttonAriaLabel="Co pro můžu udělat"
          />
        </div>
      </Container>
    </Section>
  );
}
