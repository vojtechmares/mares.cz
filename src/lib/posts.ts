import type { CollectionEntry } from "astro:content";
import { t } from "../i18n";
import { localizeUrl } from "../i18n/routes";
import type { Locale } from "../i18n/types";
import { bareSlug, getLocalizedCollection } from "./content";

const WORDS_PER_MINUTE = 200;

export function readingTimeMinutes(body: string | undefined): number {
  const words = body?.split(/\s+/).length ?? 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Published posts of a locale, newest first. */
export async function getPublishedPosts(locale: Locale): Promise<CollectionEntry<"blog">[]> {
  const posts = await getLocalizedCollection("blog", locale, ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.publish_time.valueOf() - a.data.publish_time.valueOf());
}

/** Shape a blog post for the table-like post rows. */
export function toPostRow(post: CollectionEntry<"blog">, locale: Locale) {
  return {
    href: localizeUrl(`/blog/${bareSlug(post.id)}`, locale),
    title: post.data.title,
    date: post.data.publish_time,
    tag: post.data.tags[0],
    meta: t(locale, "blog.minutes_short", { count: readingTimeMinutes(post.body) }),
  };
}
