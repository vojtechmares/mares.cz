import type { ReactNode } from "react";

import { Body } from "../../components/ui/body";
import { Card } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";
import { Prose } from "../../components/prose";
import { t, type Locale } from "../../i18n";

interface ReferencesContainerProps {
  locale: Locale;
  children?: ReactNode;
}

export function ReferencesContainer({ locale, children }: ReferencesContainerProps) {
  return (
    <Section id="references" variant="default" aria-label={t(locale, "references.aria_label")}>
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <Heading level="h2">{t(locale, "references.heading")}</Heading>
          <Text variant="secondary" className="mt-4 tracking-tight">
            {t(locale, "references.subheading")}
          </Text>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">{children}</div>
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
    <Card variant="surface" hover={true} className="group flex h-full flex-col">
      <figure className="flex flex-1 flex-col">
        <Prose className="prose-p:text-base md:prose-p:text-lg">{content}</Prose>
        <div className="mt-auto">
          <figcaption className="relative mt-6 flex items-center border-t border-zinc-300 pt-6">
            <div className="overflow-hidden pr-4 md:pr-6">{image}</div>
            <div>
              <Body as="div" color="primary" className="font-display text-base">
                {authorName}
              </Body>
              <Body as="div" color="secondary" variant="small" className="mt-1">
                {authorRole}
              </Body>
            </div>
          </figcaption>
        </div>
      </figure>
    </Card>
  );
}
