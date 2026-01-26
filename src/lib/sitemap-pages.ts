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

  // Blog posts
  const blogDir = join(contentDir, "blog");
  const archiveDates = new Set<string>();

  for (const file of listMarkdownFiles(blogDir)) {
    const content = readFileSync(join(blogDir, file), "utf-8");
    const fm = extractFrontmatter(content);
    if (!fm || isDraft(fm)) continue;

    urls.push(`${base}/blog/${getSlug(file)}`);

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

  // Blog archive pages
  for (const path of archiveDates) {
    urls.push(`${base}/blog/archive/${path}`);
  }

  // Pages
  const pageDir = join(contentDir, "page");
  for (const file of listMarkdownFiles(pageDir)) {
    const content = readFileSync(join(pageDir, file), "utf-8");
    const fm = extractFrontmatter(content);
    if (!fm || isDraft(fm) || isHidden(fm)) continue;

    urls.push(`${base}/${getSlug(file)}`);
  }

  // Training courses
  const trainingDir = join(contentDir, "training");
  for (const file of listMarkdownFiles(trainingDir)) {
    const content = readFileSync(join(trainingDir, file), "utf-8");
    const fm = extractFrontmatter(content);
    if (!fm || isDraft(fm)) continue;

    urls.push(`${base}/skoleni/${getSlug(file)}`);
  }

  return urls;
}
