import { defineMiddleware } from "astro:middleware";
import { englishPathToCzech, localizeUrl } from "./i18n/routes";

/**
 * Middleware that handles English URL routing and preserves locale through rewrites.
 *
 * When a request comes in for /en/..., we:
 * 1. Store the locale in `context.locals.locale`
 * 2. Translate English path segments to Czech equivalents
 * 3. Rewrite internally to the Czech page file
 *
 * For Czech paths, we check the Accept-Language header and redirect
 * non-Czech/Slovak visitors to the English version (unless they have
 * a `lang` cookie indicating explicit language choice).
 *
 * context.rewrite() re-runs middleware, so we guard against overwriting
 * the locale on the second pass.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith("/api/")) {
    return next();
  }

  if (pathname.startsWith("/en")) {
    context.locals.locale = "en";
    const czechPath = englishPathToCzech(pathname);
    return context.rewrite(czechPath);
  }

  if (!context.locals.locale) {
    const langCookie = context.cookies.get("lang");

    if (!langCookie && !isMachineReadablePath(pathname)) {
      const acceptLang = context.request.headers.get("Accept-Language");
      if (acceptLang && !prefersCzechOrSlovak(acceptLang)) {
        const englishUrl = localizeUrl(pathname, "en");
        return context.redirect(englishUrl, 302);
      }
    }

    context.locals.locale = "cs";
  }

  const response = await next();
  response.headers.set("Content-Language", context.locals.locale === "en" ? "en" : "cs");
  return response;
});

/**
 * Routes that are fetched by machines (crawlers, feed readers) against the canonical
 * Czech URL. Accept-Language negotiation must not redirect these, or unfurled link
 * previews end up with the wrong-locale card image.
 */
function isMachineReadablePath(pathname: string): boolean {
  return pathname.endsWith("/card.png") || pathname.endsWith("/rss.xml") || pathname === "/robots.txt";
}

/**
 * Parse Accept-Language header and check if the top preferred language is Czech or Slovak.
 * Uses standard quality-value parsing (e.g., "en-US,en;q=0.9,cs;q=0.8" → false).
 */
function prefersCzechOrSlovak(header: string): boolean {
  const languages = header.split(",").map((part) => {
    const [lang, ...params] = part.trim().split(";");
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? parseFloat(qParam.trim().substring(2)) : 1;
    return { lang: lang.trim().split("-")[0].toLowerCase(), q };
  });

  languages.sort((a, b) => b.q - a.q);
  const topLang = languages[0]?.lang;
  return topLang === "cs" || topLang === "sk";
}
