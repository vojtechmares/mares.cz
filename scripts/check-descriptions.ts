import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const MIN_LENGTH = 90;
const MAX_LENGTH = 160;

const CONTENT_DIR = "src/content";
const COLLECTIONS = ["blog", "training", "page"];

interface Violation {
  source: string;
  file: string;
  length: number;
  description: string;
}

function getMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (entry.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractDescription(content: string): string | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = match[1];

  // Handle multiline description with pipe (|) syntax
  const pipeMatch = frontmatter.match(/^description:\s*\|\s*\n((?:[ \t]+.+\n?)*)/m);
  if (pipeMatch) {
    const text = pipeMatch[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ");
    return text || null;
  }

  // Handle quoted or unquoted single-line description
  const lineMatch = frontmatter.match(/^description:\s*["']?(.*?)["']?\s*$/m);
  if (lineMatch) {
    return lineMatch[1];
  }

  return null;
}

const violations: Violation[] = [];

// Check content collections
for (const collection of COLLECTIONS) {
  const dir = join(CONTENT_DIR, collection);
  const files = getMarkdownFiles(dir);

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const description = extractDescription(content);

    if (description === null || description === "") continue;

    const len = description.length;
    if (len < MIN_LENGTH || len > MAX_LENGTH) {
      violations.push({
        source: collection,
        file: relative(".", file),
        length: len,
        description,
      });
    }
  }
}

// Check i18n translation meta_description keys
const I18N_DIR = "src/i18n/translations";
const I18N_FILES: Record<string, string> = { "cs.ts": "cs", "en.ts": "en" };

for (const [fileName, locale] of Object.entries(I18N_FILES)) {
  const filePath = join(I18N_DIR, fileName);
  const i18nContent = readFileSync(filePath, "utf-8");
  const metaDescRegex = /"([^"]*meta_description[^"]*)"\s*:\s*\n?\s*"([^"]+(?:\\.[^"]*)*?)"/g;
  let i18nMatch;
  while ((i18nMatch = metaDescRegex.exec(i18nContent)) !== null) {
    const key = i18nMatch[1];
    const description = i18nMatch[2];
    // Skip descriptions with template placeholders — length can't be determined statically
    if (/\{.+\}/.test(description)) continue;
    const len = description.length;
    if (len < MIN_LENGTH || len > MAX_LENGTH) {
      violations.push({
        source: `i18n (${locale}) [${key}]`,
        file: filePath,
        length: len,
        description,
      });
    }
  }
}

// Check site.ts hardcoded descriptions
const siteContent = readFileSync("src/lib/site.ts", "utf-8");
const descriptionRegex = /description:\s*"([^"]+)"/g;
let siteMatch;
while ((siteMatch = descriptionRegex.exec(siteContent)) !== null) {
  const description = siteMatch[1];
  const len = description.length;
  if (len < MIN_LENGTH || len > MAX_LENGTH) {
    violations.push({
      source: "site.ts",
      file: "src/lib/site.ts",
      length: len,
      description,
    });
  }
}

// Report results
if (violations.length === 0) {
  console.log("All descriptions are within the recommended 90-160 character range.");
  process.exit(0);
}

console.log(`Found ${violations.length} description(s) outside the 90-160 character range:\n`);

for (const v of violations) {
  const status = v.length < MIN_LENGTH ? "TOO SHORT" : "TOO LONG";
  console.log(`[${status}] ${v.source} — ${v.file} (${v.length} chars)`);
  console.log(`  "${v.description}"\n`);
}

process.exit(1);
