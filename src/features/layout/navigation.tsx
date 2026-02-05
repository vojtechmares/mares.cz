import clsx from "clsx";

import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Container } from "../../components/ui/container";
import { Link } from "../../components/ui/link";

// import {StaticNavigationLinks} from "@/lib/site"

type NavLink = {
  name: string;
  href: string;
};

function LinkItem({ href, name, className = "" }: { href: string; name: string; className?: string }) {
  return (
    <a href={href} className={clsx(className, "text-xl font-bold text-zinc-100 transition-colors hover:text-zinc-300")}>
      {name}
    </a>
  );
}

function MobileNavigation({ links }: { links: NavLink[] }) {
  return (
    <nav className="relative z-50 lg:hidden">
      <div className="row flex justify-between">
        <div className="flex items-center md:gap-x-12">
          <span className="font-sans text-xl font-bold text-orange-500">
            <a href="/">Vojtěch Mareš</a>
          </span>
        </div>
        <div className="flex items-center gap-x-5 md:gap-x-8">
          <Button href="https://cal.com/vojtechmares/30min" variant="accent">
            <Body as="span" color="primary" className="font-mono! text-lg font-bold tracking-tight">
              Domluvme si schůzku
            </Body>
          </Button>
        </div>
      </div>
      <div className="align-center mt-4 flex flex-row gap-x-4 gap-y-2 overflow-x-scroll whitespace-nowrap">
        {links.map((link) => (
          <LinkItem key={link.name} href={link.href} name={link.name} />
        ))}
      </div>
    </nav>
  );
}

// desktop navigation v2, needs more links to be added, to make it look good
// function DesktopNavigation() {
//   return (
//     <nav className="relative z-50 hidden lg:block">
//       <div className="flex justify-between">
//         <div className="flex items-center md:gap-x-12">
//           <span className="text-2xl font-extrabold tracking-tight">
//             <Link
//               href="/"
//               className="py-2 focus-visible:outline-black"
//             >
//               Vojtěch Mareš
//             </Link>
//           </span>
//         </div>
//         <div className="flex items-center gap-x-8">
//           <Button href="mailto:vojtech@mares.cz" color="amber">
//             <span className="text-lg font-bold tracking-tight">
//               Napište mi <span className="hidden lg:inline">ještě dnes</span>
//             </span>
//           </Button>
//         </div>
//       </div>
//       <div className="mt-6">
//         <div className="flex flex-row flex-wrap gap-x-6 gap-y-3">
//           {links.map((link) => (
//             <LinkItem key={link.name} href={link.href} name={link.name} />
//           ))}
//         </div>
//       </div>
//     </nav>
//   );
// }

function DesktopNavigation({ links }: { links: NavLink[] }) {
  return (
    <nav className="relative z-50 hidden lg:block">
      <div className="flex justify-between">
        <div className="flex justify-start gap-x-6">
          <div className="flex items-center md:gap-x-12">
            <span className="font-sans text-xl font-bold text-orange-500">
              <a href="/">Vojtěch Mareš</a>
            </span>
          </div>
          <div className="flex flex-row flex-wrap items-center gap-x-6">
            {links.map((link) => (
              <LinkItem key={link.name} href={link.href} name={link.name} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-x-8">
          <Button href="https://cal.com/vojtechmares/30min" variant="accent">
            <Body as="span" color="primary" className="font-mono! text-lg font-bold tracking-tight">
              Domluvme si schůzku
            </Body>
          </Button>
        </div>
      </div>
      {/* <div className="mt-6">
        <div className="flex flex-row flex-wrap gap-x-6 gap-y-3">
          {links.map((link) => (
            <LinkItem key={link.name} href={link.href} name={link.name} />
          ))}
        </div>
      </div> */}
    </nav>
  );
}

export function Navigation({ links }: { links: NavLink[] }) {
  // const pageLinks: NavLink[] = pages
  //     .filter((page) => page.featured)
  //     .map((page) => ({
  //         name: page.title,
  //         href: `/${page.slug}`,
  //     }));

  //   const links = [...StaticNavigationLinks, ...pageLinks]

  return (
    <>
      <header className="bg-zinc-900 py-4 lg:py-1">
        <Container>
          <MobileNavigation links={links} />
          <DesktopNavigation links={links} />
        </Container>
      </header>
    </>
  );
}
