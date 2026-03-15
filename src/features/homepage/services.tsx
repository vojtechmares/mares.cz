import clsx from "clsx";

import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";
import { t, type Locale } from "../../i18n";
import { localizeUrl } from "../../i18n/routes";

type ServiceProps = {
  name: string;
  description: string;
  href: string;
  featured?: boolean;
  buttonText: string;
  buttonAriaLabel?: string;
  price: string;
};

function Service({ name, description, href, featured = false, buttonText, buttonAriaLabel, price }: ServiceProps) {
  return (
    <Card
      variant={featured ? "accent" : "inverse"}
      className={clsx("flex h-full flex-col", featured && "order-first lg:order-0")}
      hover={true}
    >
      <Heading level="h3" variant={featured ? "primary" : "inverse"}>
        {name}
      </Heading>
      <Body as="span" color={featured ? "primary" : "inverse"} className="mt-2 font-mono text-lg font-bold">
        {price}
      </Body>
      <Body color={featured ? "primary" : "muted"} className={clsx("mt-4")}>
        {description}
      </Body>
      <div className="mt-auto flex justify-end pt-4">
        <Button href={href} style="solid" variant={featured ? "primary" : "secondary"} aria-label={buttonAriaLabel}>
          {buttonText}
        </Button>
      </div>
    </Card>
  );
}

export function Services({ locale }: { locale: Locale }) {
  return (
    <Section id="sluzby" aria-label={t(locale, "services.heading")} variant="inverse">
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <Heading level="h2" variant="inverse">
            {t(locale, "services.heading")}
          </Heading>
          <Text variant="muted" className="mt-4">
            {t(locale, "services.subheading")}
          </Text>
        </div>
        <div className="mt-10 grid max-h-none max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:mx-0">
          <Service
            name={t(locale, "services.consultation")}
            price={t(locale, "services.consultation_price")}
            description={t(locale, "services.consultation_description")}
            buttonText={t(locale, "services.consultation_cta")}
            buttonAriaLabel={t(locale, "services.consultation_cta_aria")}
            href="https://cal.com/vojtechmares/30min"
          />
          <Service
            featured
            name={t(locale, "services.training")}
            price={t(locale, "services.training_price")}
            description={t(locale, "services.training_description")}
            href={localizeUrl("/#skoleni", locale)}
            buttonText={t(locale, "services.training_cta")}
            buttonAriaLabel={t(locale, "services.training_cta_aria")}
          />
          <Service
            name={t(locale, "services.cooperation")}
            price={t(locale, "services.cooperation_price")}
            description={t(locale, "services.cooperation_description")}
            href={localizeUrl("/sluzby", locale)}
            buttonText={t(locale, "services.cooperation_cta")}
            buttonAriaLabel={t(locale, "services.cooperation_cta_aria")}
          />
        </div>
      </Container>
    </Section>
  );
}
