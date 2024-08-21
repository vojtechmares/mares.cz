import Image, { type StaticImageData } from "next/image";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

import avatarVojtechMares from "@/images/avatars/vojtech-mares.png";
import logoGLAMI from "@/images/logos/glami.svg";
import logoFakturoid from "@/images/logos/fakturoid.svg";
import logoCybroslabs from "@/images/logos/cybroslabs-black.jpeg";

type Company = {
  name: string;
  logo: StaticImageData;
};

const companies: Company[] = [
  { name: "GLAMI", logo: logoGLAMI },
  { name: "Fakturoid", logo: logoFakturoid },
  { name: "Cybros Labs", logo: logoCybroslabs },
];

export function Hero() {
  return (
    <>
      <Container className="pt-5 lg:pt-8">
        <div className="flex flex-col justify-center md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-black tracking-tight text-black sm:text-7xl">
              Jsem{" "}
              <span className="relative whitespace-nowrap text-amber-500">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute left-0 top-2/3 h-[0.58em] w-full fill-amber-500/70"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative">Vojtěch Mareš</span>
              </span>
              , DevOps architekt.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-700">
              Společně snížíme Vaše náklady na infrasturkuturu, zbavíme se
              technického dluhu a připravíme Vaší IT infrastrukturu na rapidní
              škálování.
            </p>
            <div className="mt-10 flex flex-col gap-y-6 sm:flex-row sm:justify-start sm:gap-x-6 md:gap-y-0">
              <Button href="https://cal.com/vojtechmares/30min" size="large">
                Domluvme si schůzku
              </Button>
              <Button
                href="mailto:vojtech@mares.cz"
                size="large"
                variant="outline"
              >
                Napište mi
              </Button>
            </div>
            <div className="mt-10">
              {" "}
              {/* mt-36 lg:mt-44 */}
              <p className="font-display text-lg tracking-tight text-slate-700">
                Moji spokojení klienti, přidejte se k nim i Vy.
              </p>
              <ul
                role="list"
                className="mt-4 flex flex-wrap items-center justify-center gap-x-6 sm:justify-start"
              >
                {companies.map((company) => (
                  <li key={company.name} className="flex">
                    <Image
                      className="h-16 object-scale-down"
                      src={company.logo}
                      alt={company.name}
                      width={128}
                      height={64}
                      priority
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Image
            className="mx-auto hidden pt-10 md:mx-0 md:block md:pt-0"
            priority
            width={400}
            height={800}
            src={avatarVojtechMares}
            alt="Vojtěch Mareš"
          />
        </div>
      </Container>
    </>
  );
}
