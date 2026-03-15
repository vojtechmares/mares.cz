import { defineMiddleware } from "astro:middleware";
import { englishPathToCzech } from "./i18n/routes";

/**
 * Middleware that handles English URL routing.
 *
 * When a request comes in for /en/..., we:
 * 1. Translate English path segments to Czech equivalents
 * 2. Rewrite internally to the Czech page file
 *
 * Astro's built-in i18n sets `Astro.currentLocale` to "en" for /en/ prefixed paths,
 * so components will receive the correct locale automatically.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only handle /en/ prefixed paths
  if (pathname.startsWith("/en")) {
    // Translate English path segments to Czech page routes
    const czechPath = englishPathToCzech(pathname);

    // Rewrite to the Czech page route (Astro.currentLocale stays "en")
    return context.rewrite(czechPath);
  }

  return next();
});
