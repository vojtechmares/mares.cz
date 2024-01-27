import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-test py-32"
    >
      <Container className="relative">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Pojďme do toho společně
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Je na čase pozvednout Vaši infrastrukturu na dnešní standardy.
            Infrastruktura má ukázat Vaši aplikaci světu, ne ji držet při zemi.
          </p>
          <Button
            href="mailto:jsem@vojtechmares.com"
            color="white"
            size="large"
            className="mt-10"
          >
            Napište mi
          </Button>
        </div>
      </Container>
    </section>
  );
}
