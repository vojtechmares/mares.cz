import { getCollection, getEntry, type CollectionEntry, type CollectionKey } from "astro:content";
import type { Locale } from "../i18n/types";

/**
 * Strip the locale prefix from a content entry ID.
 * "en/kubernetes" -> "kubernetes", "kubernetes" -> "kubernetes"
 */
export function bareSlug(entryId: string): string {
  return entryId.replace(/^en\//, "");
}

/**
 * Resolve a slug to a content entry ID for the given locale.
 * Czech entries live at root level, English entries under "en/".
 */
function resolveEntryId(slug: string, locale: Locale): string {
  return locale === "cs" ? slug : `en/${slug}`;
}

/**
 * Filter predicate: does this entry belong to the given locale?
 */
function isLocaleEntry(entryId: string, locale: Locale): boolean {
  if (locale === "cs") {
    return !entryId.includes("/");
  }
  return entryId.startsWith("en/");
}

/**
 * Get a single entry from a collection, resolved by locale.
 */
export async function getLocalizedEntry<C extends CollectionKey>(
  collection: C,
  slug: string,
  locale: Locale,
): Promise<CollectionEntry<C> | undefined> {
  const id = resolveEntryId(slug, locale);
  return (await getEntry(collection, id)) as CollectionEntry<C> | undefined;
}

/**
 * Get all entries from a collection filtered by locale.
 */
export async function getLocalizedCollection<C extends CollectionKey>(
  collection: C,
  locale: Locale,
  filter?: (entry: CollectionEntry<C>) => unknown,
): Promise<CollectionEntry<C>[]> {
  return getCollection(collection, (entry) => {
    if (!isLocaleEntry(entry.id, locale)) return false;
    return filter ? filter(entry as CollectionEntry<C>) : true;
  }) as Promise<CollectionEntry<C>[]>;
}
