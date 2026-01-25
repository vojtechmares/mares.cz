import type { ReactNode } from "react";

import { Body } from "../../components/ui/body";
import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";

interface ReferencesContainerProps {
  children?: ReactNode;
}

export function ReferencesContainer({ children }: ReferencesContainerProps) {
  return (
    <Section id="references" variant="default" aria-label="Co o mně napsali moji klienti.">
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <Heading level="h2">Reference</Heading>
          <Text variant="secondary" className="mt-4 tracking-tight">
            Co o mně říkají moji klienti.
          </Text>
        </div>
        <div role="list" className="mx-auto mt-10 flex max-w-2xl flex-col lg:max-w-4xl">
          {children}
        </div>
      </Container>
    </Section>
  );
}

interface ReferenceCardProps {
  authorName: string;
  authorRole: string;
  content?: ReactNode;
  image?: ReactNode;
}

export function ReferenceCard({ authorName, authorRole, content, image }: ReferenceCardProps) {
  return (
    <Card variant="surface" className="mb-10">
      <figure>
        <div className="prose text-lg tracking-tight text-zinc-900">{content}</div>
        <figcaption className="relative mt-6 flex items-center justify-between border-t border-zinc-300 pt-6">
          <div>
            <Body as="div" color="primary" className="font-display text-base">
              {authorName}
            </Body>
            <Body as="div" color="secondary" variant="sm" className="mt-1">
              {authorRole}
            </Body>
          </div>
          <div className="overflow-hidden bg-zinc-100">{image}</div>
        </figcaption>
      </figure>
    </Card>
  );
}
