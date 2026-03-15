import type { TranslationKey } from "./translations/cs";
import { cs } from "./translations/cs";
import { en } from "./translations/en";
import type { Locale } from "./types";

const translations: Record<Locale, Record<TranslationKey, string>> = { cs, en };

/**
 * Get a translated string for the given locale and key.
 * Supports simple interpolation: `{variable}` in the translation string
 * will be replaced with the corresponding value from `params`.
 */
export function t(locale: Locale, key: TranslationKey, params?: Record<string, string | number>): string {
  const value = translations[locale][key];
  if (!params) return value;

  return value.replace(/\{(\w+)\}/g, (_, name) => {
    const param = params[name];
    return param !== undefined ? String(param) : `{${name}}`;
  });
}

export type { TranslationKey };
export { type Locale, defaultLocale, locales } from "./types";
