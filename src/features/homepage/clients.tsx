import type { ReactNode } from "react";

import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";

interface ClientsProps {
  children?: ReactNode;
}

export function Clients({ children }: ClientsProps) {
  return (
    <Section id="clients" ariaLabel="Moji klienti" variant="surface">
      <Container>
        <Heading level="h2" className="md:text-center">
          Moji klienti
        </Heading>
        <Text variant="secondary" className="mt-4 tracking-tight md:text-center">
          Společnosti, které mi důvěřují a se kterými mám tu čest dlouhodobě spolupracovat.
        </Text>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {children}
        </div>
      </Container>
    </Section>
  );
}
