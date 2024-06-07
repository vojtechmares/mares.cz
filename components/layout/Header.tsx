import Link from "next/link";

import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export function Header() {
  return (
    <>
      <header className="py-10">
        <Container>
          <nav className="relative z-50 flex justify-between">
            <div className="flex items-center md:gap-x-12">
              <span className="text-2xl font-bold">
                <Link
                  href="/"
                  className="rounded-full px-4 py-2 focus-visible:outline-black"
                >
                  Vojtěch Mareš
                </Link>
              </span>
              <div className="hidden md:flex md:gap-x-6">
                <Link
                  href="/#skoleni"
                  className="inline-block rounded-full px-4 py-2 text-lg font-medium text-slate-700 hover:bg-slate-100 hover:text-black focus-visible:outline-black"
                >
                  Školení
                </Link>
                {/* <Link href="/pripadove-studie" className="inline-block rounded-full py-2 px-4 text-lg font-medium text-slate-700 hover:bg-slate-100 hover:text-black focus-visible:outline-black">Případové studie</Link> */}
                <Link
                  href="/clanky"
                  className="inline-block rounded-full px-4 py-2 text-lg font-medium text-slate-700 hover:bg-slate-100 hover:text-black focus-visible:outline-black"
                >
                  Články
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-x-5 md:gap-x-8">
              <Button href="mailto:jsem@vojtechmares.com" color="amber">
                <span className="text-lg">
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
