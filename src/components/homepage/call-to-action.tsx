import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { CallToAction as CTA } from "../landing/call-to-action";

export function CallToAction() {
  return (
    <CTA id="pojdme-do-toho">
      <div className="mx-auto max-w-xl text-center">
        <Heading level="h2" variant="primary">
          Pojďme do toho společně
        </Heading>
        <p className="mt-4 text-lg tracking-tight text-zinc-900">
          Nastal čas posunout vaši infrastrukturu na úroveň současných
          standardů. Infrastruktura má vaši aplikaci představit světu, nikoli ji
          držet zpátky.
        </p>
        <Button
          href="https://cal.com/vojtechmares/30min"
          variant="primary"
          size="large"
          className="mt-10"
        >
          Domluvme si schůzku
        </Button>
      </div>
    </CTA>
  );
}
