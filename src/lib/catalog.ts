import type { CollectionEntry } from "astro:content";
import { getCurrencyForLocale } from "../i18n/formatting";
import type { Locale } from "../i18n/types";
import { bareSlug, getLocalizedCollection } from "./content";

export interface CatalogItem {
  slug: string;
  title: string;
  description: string;
  /** Length in days. */
  length: number;
  featured: boolean;
  /** Per-person price on a public session, in the locale currency. */
  priceOpen: number;
  /** Price of a corporate training, in the locale currency. */
  priceCorporate: number;
  icon?: { src: string; alt: string | null };
}

function priceFor(variants: { amount: number; currency: string }[], currency: string): number {
  return (variants.find((variant) => variant.currency === currency) ?? variants[0]).amount;
}

export function toCatalogItem(training: CollectionEntry<"training">, locale: Locale): CatalogItem {
  const currency = getCurrencyForLocale(locale);
  return {
    slug: bareSlug(training.id),
    title: training.data.title,
    description: training.data.description.trim(),
    length: training.data.length,
    featured: training.data.featured,
    priceOpen: priceFor(training.data.price.open, currency),
    priceCorporate: priceFor(training.data.price.corporate, currency),
    icon: training.data.icon ?? training.data.logo,
  };
}

/**
 * Published trainings for the catalog, the nav dropdown and the footer.
 * Featured trainings first, the rest alphabetically.
 */
export async function getCatalog(locale: Locale): Promise<CatalogItem[]> {
  const trainings = await getLocalizedCollection("training", locale, ({ data }) => !data.draft);
  return trainings
    .map((training) => toCatalogItem(training, locale))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title, locale));
}
