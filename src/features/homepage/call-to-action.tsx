import { Button } from "../../components/ui/button";
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";

export function CallToAction() {
  return (
    <Section id="pojdme-do-toho" variant="inverse">
      <div className="mx-auto max-w-xl text-center">
        <Heading level="h2" variant="inverse">
          Pojďme do toho společně
        </Heading>
        <Text variant="inverse" className="mt-4">
          Nastal čas posunout vaši infrastrukturu na úroveň současných
          standardů. Infrastruktura má vaši aplikaci představit světu, nikoli ji
          držet zpátky.
        </Text>
        <Button
          href="https://cal.com/vojtechmares/30min"
          variant="accent"
          size="large"
          className="mt-10"
        >
          Domluvme si schůzku
        </Button>
      </div>
    </Section>
  );
}
