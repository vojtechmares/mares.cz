import Image from "next/image";

import { Container } from "@/components/Container";
import avatarAntoninHoskovec from "@/public/images/people/antonin-hoskovec.jpg";
import avatarLadislavCapka from "@/public/images/people/ladislav-capka.jpg";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";

const references = [
  {
    content:
      "Když jsme Vojtu poznali, byli jsme zrovna v procesu migrace existujících Kubernetes clusterů na nové, vylepšené (vlastní) infrastrukturní balíčky. Krásně jsme si sedli v automatizaci jak vytváření/strhávání infrastruktury, tak v automatizaci nasazování a použitých technologiích (AWS, Kubernetes, Terraform, Python, GitLab. Docker). Vojta pro nás navrhnul a vytvořil nové Terraform repozitáře, pomohl nám i se školením týmu a mladších kolegů a byl dlouhodobě k dispozici pro řešení ad-hoc problémů.",
    author: {
      name: "Antonín Hoškovec",
      role: "AI team lead, GLAMI",
      image: avatarAntoninHoskovec,
    },
  },
  {
    content:
      "S Vojtou Marešem jsme za poslední roky úspěšně zvládli mnoho technických výzev, převážně ve světě Kubernetes, kde se Vojta skvěle orientuje z pohledu operations i vývoje. Společně jsme automatizovali procesy skripty jako GitHub Workflows či GitLab pipelines a řešili komplexní infrastruktury pro veřejné cloudy (AWS, GCP) i vlastní RKE2 clustery s high-availability pokrytím. Vojtovy znalosti sahají i do vývoje – jeho přesah nám umožnil vytvořit základní koncept Kubernetes operátoru v Go, který je klíčovou součástí našeho produktu. Díky své zkušenosti a schopnosti dobře se učit nové věci je pro něj svět Kubernetes otevřenou knihou, a máloco ho zde dokáže překvapit.",
    author: {
      name: "Ladislav Čapka",
      role: "CTO, cybros labs",
      image: avatarLadislavCapka,
    },
  },
];

function QuoteIcon(props: any) {
  return (
    <svg aria-hidden="true" width={105} height={78} {...props}>
      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
    </svg>
  );
}

export function References() {
  return (
    <Section
      id="references"
      background="slate"
      aria-label="Co o mně napsali moji klienti."
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <Heading level="h2">Reference</Heading>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Co o mně říkají moji klienti.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-y-6 sm:gap-y-8 lg:max-w-4xl"
        >
          {references.map((testimonial, idx) => (
            <li key={idx}>
              <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                <QuoteIcon className="absolute top-6 left-6 fill-slate-100" />
                <blockquote className="relative">
                  <p className="text-lg tracking-tight text-black">
                    {testimonial.content}
                  </p>
                </blockquote>
                <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                  <div>
                    <div className="font-display text-base text-black">
                      {testimonial.author.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {testimonial.author.role}
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-full bg-slate-50">
                    <Image
                      className="h-14 w-14 object-cover"
                      src={testimonial.author.image}
                      alt={testimonial.author.name}
                      width={56}
                      height={56}
                    />
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
