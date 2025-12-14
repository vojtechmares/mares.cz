import { type ReactNode } from "react";

import { Container } from "../ui/container";
import { Section } from "../ui/section";

export function CallToAction({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <Section id={id} variant="accent">
      <Container>{children}</Container>
    </Section>
  );
}
