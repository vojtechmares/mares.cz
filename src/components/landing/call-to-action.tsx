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
        <Section id={id} background="amber">
            <Container>{children}</Container>
        </Section>
    );
}
