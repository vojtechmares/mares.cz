import clsx from "clsx";

import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Container } from "../../components/ui/container";
import { t, type Locale } from "../../i18n";
import { localizeUrl } from "../../i18n/routes";
import { LanguageSwitcher } from "./language-switcher";

type NavLink = {
  name: string;
  href: string;
};

function LinkItem({ href, name, className = "" }: { href: string; name: string; className?: string }) {
  return (
    <a
      href={href}
      className={clsx(
        className,
        "text-xl font-bold text-neutral-100 transition-colors hover:text-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500",
      )}
    >
      {name}
    </a>
  );
}

function MobileNavigation({ links, locale, currentPath }: { links: NavLink[]; locale: Locale; currentPath: string }) {
  return (
    <nav className="relative z-50 lg:hidden">
      <div className="row flex justify-between">
        <div className="flex items-center md:gap-x-12">
          <span className="font-sans text-xl font-bold text-orange-500">
            <a
              href={localizeUrl("/", locale)}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Vojtěch Mareš
            </a>
          </span>
        </div>
        <div className="flex items-center gap-x-5 md:gap-x-8">
          <LanguageSwitcher locale={locale} currentPath={currentPath} />
          <Button href="https://cal.com/vojtechmares/30min" variant="accent">
            <Body as="span" color="primary" className="font-mono! text-lg font-bold tracking-tight">
              {t(locale, "nav.schedule_meeting")}
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

function DesktopNavigation({ links, locale, currentPath }: { links: NavLink[]; locale: Locale; currentPath: string }) {
  return (
    <nav className="relative z-50 hidden lg:block">
      <div className="flex justify-between">
        <div className="flex justify-start gap-x-6">
          <div className="flex items-center md:gap-x-12">
            <span className="font-sans text-xl font-bold text-orange-500">
              <a
                href={localizeUrl("/", locale)}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                Vojtěch Mareš
              </a>
            </span>
          </div>
          <div className="flex flex-row flex-wrap items-center gap-x-6">
            {links.map((link) => (
              <LinkItem key={link.name} href={link.href} name={link.name} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-x-8">
          <LanguageSwitcher locale={locale} currentPath={currentPath} />
          <Button href="https://cal.com/vojtechmares/30min" variant="accent">
            <Body as="span" color="primary" className="font-mono! text-lg font-bold tracking-tight">
              {t(locale, "nav.schedule_meeting")}
            </Body>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export function Navigation({ links, locale, currentPath }: { links: NavLink[]; locale: Locale; currentPath: string }) {
  return (
    <>
      <header className="bg-neutral-900 py-4 lg:py-1">
        <Container>
          <MobileNavigation links={links} locale={locale} currentPath={currentPath} />
          <DesktopNavigation links={links} locale={locale} currentPath={currentPath} />
        </Container>
      </header>
    </>
  );
}
