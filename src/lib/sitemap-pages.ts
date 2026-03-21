import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function extractFrontmatter(content: string): string | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}

function getFrontmatterValue(frontmatter: string, key: string): string | undefined {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : undefined;
}

function isDraft(frontmatter: string): boolean {
  const value = getFrontmatterValue(frontmatter, "draft");
  return value !== "false";
}

function isHidden(frontmatter: string): boolean {
  const value = getFrontmatterValue(frontmatter, "hidden");
  return value === "true";
}

function getTags(frontmatter: string): string[] {
  const value = getFrontmatterValue(frontmatter, "tags");
  if (!value) return [];
  const match = value.match(/\[([^\]]*)\]/);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((t) => t.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function getSlug(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

function listMarkdownFiles(dir: string): string[] {
  try {
    return readdirSync(dir).filter((f) => /\.mdx?$/.test(f));
  } catch {
    return [];
  }
}

export function getContentPages(site: string): string[] {
  const base = site.replace(/\/$/, "");
  const contentDir = join(import.meta.dirname, "..", "content");
  const urls: string[] = [];

  // Static pages not generated from content collections
  urls.push(`${base}/`);
  urls.push(`${base}/en/`);
  urls.push(`${base}/blog`);
  urls.push(`${base}/en/blog`);
  urls.push(`${base}/prednasky`);
  urls.push(`${base}/en/talks`);
  urls.push(`${base}/sluzby`);
  urls.push(`${base}/en/services`);
  urls.push(`${base}/skoleni/verejne-terminy`);
  urls.push(`${base}/en/training/public-sessions`);

  // Czech blog posts
  const blogDir = join(contentDir, "blog");
  const archiveDates = new Set<string>();
  const csTags = new Set<string>();

  for (const file of listMarkdownFiles(blogDir)) {
    const content = readFileSync(join(blogDir, file), "utf-8");
    const fm = extractFrontmatter(content);
    if (!fm || isDraft(fm)) continue;

    urls.push(`${base}/blog/${getSlug(file)}`);

    for (const tag of getTags(fm)) {
      csTags.add(tag);
    }

    const publishTime = getFrontmatterValue(fm, "publish_time");
    if (publishTime) {
      const match = publishTime.match(/^(\d{4})-(\d{2})/);
      if (match) {
        const [, year, month] = match;
        archiveDates.add(`${year}`);
        archiveDates.add(`${year}/${month}`);
      }
    }
  }

  for (const path of archiveDates) {
    urls.push(`${base}/blog/archive/${path}`);
  }

  for (const tag of csTags) {
    urls.push(`${base}/blog/tag/${tag}`);
  }

  // English blog posts
  const enBlogDir = join(contentDir, "blog", "en");
  const enArchiveDates = new Set<string>();
  const enTags = new Set<string>();

  for (const file of listMarkdownFiles(enBlogDir)) {
    const content = readFileSync(join(enBlogDir, file), "utf-8");
    const fm = extractFrontmatter(content);
    if (!fm || isDraft(fm)) continue;

    urls.push(`${base}/en/blog/${getSlug(file)}`);

    for (const tag of getTags(fm)) {
      enTags.add(tag);
    }

    const publishTime = getFrontmatterValue(fm, "publish_time");
    if (publishTime) {
      const match = publishTime.match(/^(\d{4})-(\d{2})/);
      if (match) {
        const [, year, month] = match;
        enArchiveDates.add(`${year}`);
        enArchiveDates.add(`${year}/${month}`);
      }
    }
  }

  for (const path of enArchiveDates) {
    urls.push(`${base}/en/blog/archive/${path}`);
  }

  for (const tag of enTags) {
    urls.push(`${base}/en/blog/tag/${tag}`);
  }

  // Czech pages
  const pageDir = join(contentDir, "page");
  for (const file of listMarkdownFiles(pageDir)) {
    const content = readFileSync(join(pageDir, file), "utf-8");
    const fm = extractFrontmatter(content);
    if (!fm || isDraft(fm) || isHidden(fm)) continue;

    urls.push(`${base}/${getSlug(file)}`);
  }

  // English pages
  const enPageDir = join(contentDir, "page", "en");
  for (const file of listMarkdownFiles(enPageDir)) {
    const content = readFileSync(join(enPageDir, file), "utf-8");
    const fm = extractFrontmatter(content);
    if (!fm || isDraft(fm) || isHidden(fm)) continue;

    urls.push(`${base}/en/${getSlug(file)}`);
  }

  // Czech training courses
  const trainingDir = join(contentDir, "training");
  for (const file of listMarkdownFiles(trainingDir)) {
    const content = readFileSync(join(trainingDir, file), "utf-8");
    const fm = extractFrontmatter(content);
    if (!fm || isDraft(fm)) continue;

    urls.push(`${base}/skoleni/${getSlug(file)}`);
  }

  // English training courses
  const enTrainingDir = join(contentDir, "training", "en");
  for (const file of listMarkdownFiles(enTrainingDir)) {
    const content = readFileSync(join(enTrainingDir, file), "utf-8");
    const fm = extractFrontmatter(content);
    if (!fm || isDraft(fm)) continue;

    urls.push(`${base}/en/training/${getSlug(file)}`);
  }

  return urls;
}
