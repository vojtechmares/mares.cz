import clsx from "clsx";

import { Container } from "./ui/container";
import { Button } from "./ui/button";
// import {Page} from "@/lib/strapi/types/page"

// import {StaticNavigationLinks} from "@/lib/site"

type NavLink = {
    name: string;
    href: string;
};

function LinkItem({
    href,
    name,
    className = "",
}: {
    href: string;
    name: string;
    className?: string;
}) {
    const classes =
        "inline-block rounded-full bg-slate-100 px-4 py-2 text-lg font-bold text-black focus-visible:outline-black";

    return (
        <a href={href} className={clsx(className, classes)}>
            {name}
        </a>
    );
}

function MobileNavigation({ links }: { links: NavLink[] }) {
    return (
        <nav className="relative z-50 lg:hidden">
            <div className="row flex justify-between">
                <div className="flex items-center md:gap-x-12">
                    <span className="text-2xl font-extrabold tracking-tight">
                        <a
                            href="/"
                            className="rounded-full py-2 focus-visible:outline-black"
                        >
                            Vojtěch Mareš
                        </a>
                    </span>
                </div>
                <div className="flex items-center gap-x-5 md:gap-x-8">
                    <Button href="mailto:vojtech@mares.cz" color="amber">
                        <span className="text-lg font-bold tracking-tight text-black">
                            Napište mi{" "}
                            <span className="hidden lg:inline">ještě dnes</span>
                        </span>
                    </Button>
                </div>
            </div>
            <div className="mt-4 flex flex-row flex-wrap justify-between gap-y-2">
                {links.map((link) => (
                    <LinkItem
                        key={link.name}
                        href={link.href}
                        name={link.name}
                    />
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
//               className="rounded-full py-2 focus-visible:outline-black"
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
                        <span className="text-2xl font-extrabold tracking-tight">
                            <a
                                href="/"
                                className="rounded-full py-2 focus-visible:outline-black"
                            >
                                Vojtěch Mareš
                            </a>
                        </span>
                    </div>
                    <div className="flex flex-row flex-wrap gap-x-6">
                        {links.map((link) => (
                            <LinkItem
                                key={link.name}
                                href={link.href}
                                name={link.name}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-x-8">
                    <Button href="mailto:vojtech@mares.cz" color="amber">
                        <span className="text-lg font-bold tracking-tight text-black">
                            Napište mi{" "}
                            <span className="hidden lg:inline">ještě dnes</span>
                        </span>
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
            <header className="mb-12 pt-5 lg:pt-10">
                <Container>
                    <MobileNavigation links={links} />
                    <DesktopNavigation links={links} />
                </Container>
            </header>
        </>
    );
}
