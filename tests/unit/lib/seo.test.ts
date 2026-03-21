import { describe, it, expect } from "vitest";
import { truncateDescription, formatCourseTimeRequired } from "../../../src/lib/seo";

describe("truncateDescription", () => {
  it("returns text unchanged when within limit", () => {
    expect(truncateDescription("Short text")).toBe("Short text");
  });

  it("returns text unchanged at exactly 160 characters", () => {
    const text = "a".repeat(160);
    expect(truncateDescription(text)).toBe(text);
  });

  it("truncates text exceeding 160 characters with ellipsis", () => {
    const text = "a".repeat(161);
    const result = truncateDescription(text);
    expect(result.length).toBe(160);
    expect(result).toBe("a".repeat(157) + "...");
  });

  it("respects custom maxLength", () => {
    const text = "Hello, this is a test string that is quite long";
    const result = truncateDescription(text, 20);
    expect(result.length).toBe(20);
    expect(result).toBe("Hello, this is a ...");
  });

  it("handles empty string", () => {
    expect(truncateDescription("")).toBe("");
  });
});

describe("formatCourseTimeRequired", () => {
  it("formats 1 day as PT8H", () => {
    expect(formatCourseTimeRequired(1)).toBe("PT8H");
  });

  it("formats 2 days as PT16H", () => {
    expect(formatCourseTimeRequired(2)).toBe("PT16H");
  });

  it("formats 3 days as PT24H", () => {
    expect(formatCourseTimeRequired(3)).toBe("PT24H");
  });
});
