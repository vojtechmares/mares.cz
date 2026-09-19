import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPublishedPosts, readingTimeMinutes, toPostRow } from "../../../src/lib/posts";

function post(id: string, date: string, overrides: Record<string, unknown> = {}): CollectionEntry<"blog"> {
  return {
    id,
    body: "slovo ".repeat(400),
    data: {
      title: `Post ${id}`,
      tags: ["kubernetes", "gitops"],
      draft: false,
      publish_time: new Date(date),
      ...overrides,
    },
  } as unknown as CollectionEntry<"blog">;
}

describe("readingTimeMinutes", () => {
  it("rounds to whole minutes at 200 words per minute", () => {
    expect(readingTimeMinutes("slovo ".repeat(900))).toBe(5);
  });

  it("never reports less than one minute", () => {
    expect(readingTimeMinutes("krátký text")).toBe(1);
    expect(readingTimeMinutes(undefined)).toBe(1);
  });
});

describe("toPostRow", () => {
  it("links Czech posts without a locale prefix and uses the first tag", () => {
    const row = toPostRow(post("helm", "2024-10-01"), "cs");
    expect(row.href).toBe("/blog/helm");
    expect(row.tag).toBe("kubernetes");
    expect(row.meta).toBe("2 min");
  });

  it("strips the locale folder from English entries", () => {
    expect(toPostRow(post("en/helm", "2024-10-01"), "en").href).toBe("/en/blog/helm");
  });
});

describe("getPublishedPosts", () => {
  beforeEach(() => {
    vi.mocked(getCollection).mockReset();
  });

  it("returns published posts of the locale, newest first", async () => {
    const entries = [
      post("old", "2023-01-01"),
      post("new", "2025-01-01"),
      post("draft", "2026-01-01", { draft: true }),
      post("en/english", "2026-02-01"),
    ];
    vi.mocked(getCollection).mockImplementation((async (_collection: string, filter?: (entry: unknown) => unknown) =>
      entries.filter((entry) => (filter ? filter(entry) : true))) as unknown as typeof getCollection);

    const posts = await getPublishedPosts("cs");
    expect(posts.map((entry) => entry.id)).toEqual(["new", "old"]);
  });
});
