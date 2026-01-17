import type { ReactNode } from "react";
import { Container } from "../../components/ui/container";
import { Section } from "../../components/ui/section";
import { Heading } from "../../components/ui/heading";
import { Card } from "../../components/ui/card";

interface ReferencesContainerProps {
  children?: ReactNode;
}

export function ReferencesContainer({ children }: ReferencesContainerProps) {
  return (
    <Section id="references" variant="default" aria-label="Co o mně napsali moji klienti.">
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <Heading level="h2">Reference</Heading>
          <p className="mt-4 text-lg tracking-tight text-zinc-700">Co o mně říkají moji klienti.</p>
        </div>
        <div role="list" className="mx-auto mt-10 flex max-w-2xl flex-col lg:max-w-4xl">
          {children}
        </div>
      </Container>
    </Section>
  );
}

interface ReferenceCardProps {
  content: string;
  authorName: string;
  authorRole: string;
  children?: ReactNode; // For the image
}

export function ReferenceCard({ content, authorName, authorRole, children }: ReferenceCardProps) {
  return (
    <Card variant="surface" className="mb-10">
      <figure>
        <blockquote className="relative">
          <p
            className="text-lg tracking-tight text-zinc-900"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </blockquote>
        <figcaption className="relative mt-6 flex items-center justify-between border-t border-zinc-300 pt-6">
          <div>
            <div className="font-display text-base text-zinc-900">{authorName}</div>
            <div className="mt-1 text-sm text-zinc-700">{authorRole}</div>
          </div>
          <div className="overflow-hidden bg-zinc-100">{children}</div>
        </figcaption>
      </figure>
    </Card>
  );
}
