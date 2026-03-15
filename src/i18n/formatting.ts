import { t, type TranslationKey } from "./index";
import type { Locale } from "./types";

const DATE_LOCALE_MAP: Record<Locale, string> = {
  cs: "cs-CZ",
  en: "en-US",
};

const LOCALE_CURRENCY_MAP: Record<Locale, string> = {
  cs: "CZK",
  en: "EUR",
};

/**
 * Get the currency code for a given locale.
 */
export function getCurrencyForLocale(locale: Locale): string {
  return LOCALE_CURRENCY_MAP[locale];
}

/**
 * Format a date using the locale-appropriate format.
 */
export function formatDate(date: Date | string, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(DATE_LOCALE_MAP[locale], options ?? { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Format a price using the locale-appropriate currency.
 */
export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(DATE_LOCALE_MAP[locale], {
    style: "currency",
    currency: LOCALE_CURRENCY_MAP[locale],
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a plain number (no currency).
 */
export function formatNumber(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(DATE_LOCALE_MAP[locale]).format(amount);
}

/**
 * Get the localized month name (1-indexed).
 */
export function getMonthName(month: number, locale: Locale): string {
  const key = `format.months.${month}` as TranslationKey;
  return t(locale, key);
}

/**
 * Get the Intl date locale string for a given app locale.
 */
export function getDateLocale(locale: Locale): string {
  return DATE_LOCALE_MAP[locale];
}

/**
 * Czech-style session count pluralization (works for both locales via translation keys).
 */
export function formatSessionCount(count: number, locale: Locale): string {
  if (count === 1) return t(locale, "sessions_hero.session_count_1", { count });
  if (count >= 2 && count <= 4) return t(locale, "sessions_hero.session_count_2_4", { count });
  return t(locale, "sessions_hero.session_count_5plus", { count });
}

/**
 * Article count pluralization.
 */
export function formatArticleCount(count: number, locale: Locale): string {
  if (locale === "en")
    return `${count} ${count === 1 ? t(locale, "blog.article_count_1") : t(locale, "blog.article_count_5plus")}`;
  if (count === 1) return `${count} ${t(locale, "blog.article_count_1")}`;
  if (count >= 2 && count <= 4) return `${count} ${t(locale, "blog.article_count_2_4")}`;
  return `${count} ${t(locale, "blog.article_count_5plus")}`;
}

/**
 * Duration text for training cards.
 */
export function formatDuration(days: number, locale: Locale): string {
  if (days === 1) return t(locale, "training_grid.duration_1day");
  return t(locale, "training_grid.duration_days", { count: days });
}
