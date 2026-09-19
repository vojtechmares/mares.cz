import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { getTrainingTerminal } from "../../../src/lib/training-terminals";

const trainingDir = join(import.meta.dirname, "../../../src/content/training");
const slugs = readdirSync(trainingDir)
  .filter((file) => file.endsWith(".md") && file !== "empty.md")
  .map((file) => file.replace(/\.md$/, ""));

describe("getTrainingTerminal", () => {
  it("falls back to a generic session for unknown trainings", () => {
    const lines = getTrainingTerminal("does-not-exist");
    expect(lines.length).toBeGreaterThan(0);
    expect("cmd" in lines[0]).toBe(true);
  });

  it.each(slugs)("has a dedicated script for %s", (slug) => {
    expect(getTrainingTerminal(slug)).not.toBe(getTrainingTerminal("does-not-exist"));
  });

  it.each(slugs)("keeps the %s script short enough for one loop and starts with a command", (slug) => {
    const lines = getTrainingTerminal(slug);
    expect("cmd" in lines[0]).toBe(true);
    expect(lines.length).toBeLessThanOrEqual(8);
    for (const line of lines) {
      const text = "cmd" in line ? line.cmd : line.out;
      // the diagram window is ~46 monospace characters wide
      expect(text.length).toBeLessThanOrEqual(46);
      if ("out" in line && line.hl) expect(line.out).toContain(line.hl);
    }
  });
});
