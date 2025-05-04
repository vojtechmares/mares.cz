import {Button} from "@/components/Button"
import {Container} from "@/components/Container"
import Head from "next/head"
import {Heading} from "@/components/ui/heading"
import {Section} from "@/components/ui/section"
import {CallToAction as CTA} from "@/components/landing/call-to-action"

export function CallToAction() {
  return (
    <CTA id="pojdme-do-toho">
      <div className="mx-auto max-w-xl text-center">
        <Heading level="h2" text="black">
          Pojďme do toho společně
        </Heading>
        <p className="mt-4 text-lg tracking-tight text-black">
          Nastal čas posunout vaši infrastrukturu na úroveň současných
          standardů. Infrastruktura má vaši aplikaci představit světu, nikoli ji
          držet zpátky.
        </p>
        <Button
          href="https://cal.com/vojtechmares/30min"
          color="black"
          size="large"
          className="mt-10"
        >
          Domluvme si schůzku
        </Button>
      </div>
    </CTA>
  )
}
