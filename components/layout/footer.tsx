import Link from "next/link";

import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { Page } from "@/lib/strapi/types/page";
import { Training } from "@/lib/strapi/types/training";

const staticLinks = [
  {
    title: "Blog",
    href: "/blog",
  },
];

export async function Footer({
  pages,
  trainings,
}: {
  pages: Page[];
  trainings: Training[];
}) {
  const pageLinks = pages.map((page) => ({
    title: page.title,
    href: `/${page.slug}`,
  }));

  const links = [...staticLinks, ...pageLinks];

  return (
    <footer className="bg-white">
      <Container className="py-8">
        <div className="py-4">
          <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-4 lg:gap-4">
            <div>
              <h4 className="text-lg font-medium">Vojtěch Mareš</h4>
              <ul className="mt-4 list-none">
                <li>
                  <Link href="tel:+420732490651" className="underline">
                    +420 732 490 651
                  </Link>
                </li>
                <li>
                  <Link href="mailto:vojtech@mares.cz" className="underline">
                    vojtech@mares.cz
                  </Link>
                </li>
                <li className="mt-4">
                  IČO
                  <br />
                  <code id="company-id">06999280</code>
                </li>
                <li className="mt-2">
                  DIČ
                  <br />
                  <code id="vat-id">CZ9709180063</code>
                </li>
                <li className="mt-2">Jsem plátce DPH</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Školení</h3>
              <ul className="mt-4 list-disc pl-4">
                {trainings.map((training) => (
                  <li key={training.slug}>
                    <Link
                      href={"/skoleni/" + training.slug}
                      className="underline"
                    >
                      {training.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Důležité odkazy</h3>
              <ul className="mt-4 list-disc pl-4">
                {links.map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} className="underline">
                      {link.title}
                    </Link>
                  </li>
                ))}
                {/* <li>
                  <Link
                    href="https://devops-skoelni.cz/?utm_source=vojtechmares&utm_medium=vojtechmares-com-website&utm_content=link"
                    className="underline"
                    target="_blank"
                  >
                    devops-skoleni.cz
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://skoleni.io/?utm_source=vojtechmares&utm_medium=vojtechmares-com-website&utm_content=link"
                    className="underline"
                    target="_blank"
                  >
                    skoleni.io
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://devopsaci.cz/?utm_source=vojtechmares&utm_medium=vojtechmares-com-website&utm_content=link"
                    className="underline"
                    target="_blank"
                  >
                    devopsaci.cz
                  </Link>
                </li> */}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Zaujal jsem vás?</h3>
              <p className="mt-4">
                Zaujal jsem vás avšak nevíte, jak přesně bych vám mohl pomoci?
                Nebojte se zeptat a společně vymyslíme, jak vám mohu pomoci.
              </p>
              <div className="mt-5 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-2">
                <Button href="https://cal.com/vojtechmares/30min">
                  Domluvme si schůzku
                </Button>
                <Button href="mailto:vojtech@mares.cz">Napište mi</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-10 md:flex-row-reverse md:justify-between">
          <div className="flex gap-x-6">
            <Link
              href="https://www.linkedin.com/in/vojtech-mares/"
              target="_blank"
              className="group"
              aria-label="Vojtěch Mareš na LinkedIn"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="h-6 w-6 fill-black group-hover:fill-slate-700"
              >
                <title>LinkedIn</title>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
            <Link
              href="https://x.com/vojtechmares_"
              target="_blank"
              className="group"
              aria-label="Vojtěch Mareš na X"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 fill-black group-hover:fill-slate-700"
              >
                <title>X</title>
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </Link>
            <Link
              href="https://github.com/vojtechmares"
              target="_blank"
              className="group"
              aria-label="Vojtěch Mareš na GitHub"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 fill-black group-hover:fill-slate-700"
              >
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </Link>
          </div>
          <p className="mt-6 text-slate-700 md:mt-0">
            Copyright &copy; {new Date().getFullYear()} Vojtěch Mareš. Všechna
            práva vyhrazena.
          </p>
        </div>
      </Container>
    </footer>
  );
}
