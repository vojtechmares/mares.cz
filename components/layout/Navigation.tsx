import Link from "next/link";

import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { link } from "fs";

const links = [
  {
    name: "Školení",
    href: "/#skoleni",
  },
  {
    name: "Blog",
    href: "https://vojtechmares.blog/",
  },
  // {
  //   name: "Případové studie",
  //   href: "/pripadove-studie",
  // },
];

export function Navigation() {
  return (
    <>
      <header className="py-10">
        <Container>
          <nav className="relative z-50 flex justify-between">
            <div className="flex items-center md:gap-x-12">
              <span className="text-2xl font-extrabold tracking-tight">
                <Link
                  href="/"
                  className="rounded-full px-4 py-2 focus-visible:outline-black"
                >
                  Vojtěch Mareš
                </Link>
              </span>
              <div className="hidden md:flex md:gap-x-6">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="inline-block rounded-full px-4 py-2 text-lg font-bold text-slate-700 hover:bg-slate-100 hover:text-black focus-visible:outline-black"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-x-5 md:gap-x-8">
              <Button href="mailto:jsem@vojtechmares.com" color="amber">
                <span className="text-lg font-bold tracking-tight">
                  Napište mi{" "}
                  <span className="hidden lg:inline">ještě dnes</span>
                </span>
              </Button>
            </div>
          </nav>
        </Container>
      </header>
    </>
  );
}
