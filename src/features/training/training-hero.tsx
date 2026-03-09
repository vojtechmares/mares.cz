import { Body } from "../../components/ui/body";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";

interface TrainingHeroProps {
  title: string;
  description: string;
  length: number;
  price: number;
  logo?: { src: string };
}

export function TrainingHero({ title, description, length, price, logo }: TrainingHeroProps) {
  const formatter = new Intl.NumberFormat("cs", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  });

  const durationLabel = length === 1 ? "1 den" : `${length} dny`;

  return (
    <Section variant="inverse" ariaLabel={`${title} školení`}>
      <Container>
        <div className="flex flex-col gap-y-8 lg:flex-row lg:justify-between lg:gap-y-0">
          <div>
            <div className="flex items-center gap-x-4">
              {logo && (
                <img
                  src={logo.src}
                  alt={`${title} logo`}
                  className={`h-20 w-auto shrink-0 ${logo.src.endsWith(".svg") ? "invert" : ""}`}
                />
              )}
              <Heading variant="inverse" level="h1">
                <span className="text-orange-500">{title}</span> školení
              </Heading>
            </div>
            <Text variant="muted" className="mt-6 max-w-xl">
              {description}
            </Text>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-mono text-3xl font-bold text-white">{durationLabel}</span>
              <Body color="muted" className="mt-1">
                délka školení
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-mono text-3xl font-bold text-white">{formatter.format(price)}</span>
              <Body color="muted" className="mt-1">
                cena za osobu bez DPH
              </Body>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
