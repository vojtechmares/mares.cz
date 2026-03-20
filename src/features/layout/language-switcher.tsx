import clsx from "clsx";
import type { Locale } from "../../i18n";
import { getAlternateUrl } from "../../i18n/routes";

interface LanguageSwitcherProps {
  locale: Locale;
  currentPath: string;
}

export function LanguageSwitcher({ locale, currentPath }: LanguageSwitcherProps) {
  const alternateUrl = getAlternateUrl(currentPath, locale);
  const currentUrl = locale === "cs" ? currentPath : getAlternateUrl(currentPath, "en");

  return (
    <div className="flex items-center gap-1 font-mono text-sm" data-lang-switcher>
      <a
        href={locale === "cs" ? currentUrl : alternateUrl}
        data-lang="cs"
        className={clsx(
          "px-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500",
          locale === "cs" ? "font-bold text-white" : "text-zinc-400 hover:text-zinc-200",
        )}
      >
        CS
      </a>
      <span className="text-zinc-600">|</span>
      <a
        href={locale === "en" ? currentUrl : alternateUrl}
        data-lang="en"
        className={clsx(
          "px-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500",
          locale === "en" ? "font-bold text-white" : "text-zinc-400 hover:text-zinc-200",
        )}
      >
        EN
      </a>
    </div>
  );
}
