import Image, { StaticImageData } from "next/image"

import logoGLAMI from "@/public/images/logos/glami.svg"
import logoFakturoid from "@/public/images/logos/fakturoid.svg"
import logoCybroslabs from "@/public/images/logos/cybroslabs-black.jpeg"
import logoNUMOTEQ from "@/public/images/logos/numoteq.png"
import { Section } from "@/components/ui/section"
import { Heading } from "@/components/ui/heading"
import { Container } from "@/components/Container"

type Client = {
  name: string
  logo: StaticImageData
}

const clients: Client[] = [
  { name: "GLAMI", logo: logoGLAMI },
  { name: "Fakturoid", logo: logoFakturoid },
  { name: "Cybros Labs", logo: logoCybroslabs },
  { name: "NUMOTEQ", logo: logoNUMOTEQ },
]

function Clients() {
  return (
    <Section id="clients" ariaLabel="Moji klienti" background="white">
      <Container>
        <Heading level="h2" className="md:text-center">
          Moji klienti
        </Heading>
        <p className="mt-4 text-lg tracking-tight text-slate-700 md:text-center">
          Společnosti, které mi důvěřují a se kterými mám tu čest dlouhodobě
          spolupracovat.
        </p>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {clients.map((client) => (
            <Image
              key={client.name}
              alt={client.name}
              src={client.logo.src}
              width={client.logo.width}
              height={client.logo.height}
              className="h-24 w-full object-contain" // w-full object-contain // col-span-2 max-h-12 w-full object-contain lg:col-span-1
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}

export { Clients }
