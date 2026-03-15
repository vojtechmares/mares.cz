import type { Locale } from "./types";
import { defaultLocale } from "./types";

/**
 * Path segment mapping: Czech (internal) <-> English (URL).
 * Keys are Czech segments, values are English equivalents.
 */
const PATH_SEGMENT_MAP: Record<string, string> = {
  prednasky: "talks",
  skoleni: "training",
  "verejne-terminy": "public-sessions",
  sluzby: "services",
};

const REVERSE_PATH_SEGMENT_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(PATH_SEGMENT_MAP).map(([cs, en]) => [en, cs]),
);

/**
 * Translate English path segments to Czech equivalents.
 * e.g. "/en/talks" -> "/prednasky"
 * e.g. "/en/training/public-sessions" -> "/skoleni/verejne-terminy"
 */
export function englishPathToCzech(path: string): string {
  // Strip /en prefix
  const stripped = path.replace(/^\/en(\/|$)/, "/");
  const segments = stripped.split("/").filter(Boolean);
  const translated = segments.map((seg) => REVERSE_PATH_SEGMENT_MAP[seg] ?? seg);
  return "/" + translated.join("/");
}

/**
 * Translate Czech path segments to English equivalents.
 * e.g. "/prednasky" -> "/talks"
 */
function czechPathToEnglish(path: string): string {
  const segments = path.split("/").filter(Boolean);
  const translated = segments.map((seg) => PATH_SEGMENT_MAP[seg] ?? seg);
  return "/" + translated.join("/");
}

/**
 * Localize a URL path for the given locale.
 * Czech paths are unprefixed, English paths get /en/ prefix with translated segments.
 *
 * Examples:
 *   localizeUrl("/prednasky", "cs") -> "/prednasky"
 *   localizeUrl("/prednasky", "en") -> "/en/talks"
 *   localizeUrl("/skoleni/kubernetes", "en") -> "/en/training/kubernetes"
 *   localizeUrl("/blog", "en") -> "/en/blog"
 *   localizeUrl("/", "en") -> "/en"
 */
export function localizeUrl(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;

  // First translate Czech segments to English
  const englishPath = czechPathToEnglish(path);
  // Add /en prefix
  if (englishPath === "/") return "/en";
  return "/en" + englishPath;
}

/**
 * Get the URL for the other locale.
 * Given a Czech path and current locale, return the path for the opposite locale.
 */
export function getAlternateUrl(czechPath: string, currentLocale: Locale): string {
  const otherLocale: Locale = currentLocale === "cs" ? "en" : "cs";
  return localizeUrl(czechPath, otherLocale);
}
