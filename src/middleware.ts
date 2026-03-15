import { defineMiddleware } from "astro:middleware";
import { englishPathToCzech } from "./i18n/routes";

/**
 * Middleware that handles English URL routing and preserves locale through rewrites.
 *
 * When a request comes in for /en/..., we:
 * 1. Store the locale in `context.locals.locale`
 * 2. Translate English path segments to Czech equivalents
 * 3. Rewrite internally to the Czech page file
 *
 * context.rewrite() re-runs middleware, so we guard against overwriting
 * the locale on the second pass.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith("/en")) {
    context.locals.locale = "en";
    const czechPath = englishPathToCzech(pathname);
    return context.rewrite(czechPath);
  }

  if (!context.locals.locale) {
    context.locals.locale = "cs";
  }
  return next();
});
