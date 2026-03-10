import { describe, it, expect } from "vitest";

import { FormatTrainingPrice, FormatTrainingDate } from "../../../src/lib/training";

describe("FormatTrainingPrice", () => {
  it("formats number as Czech CZK currency", () => {
    const result = FormatTrainingPrice(15000);
    expect(result).toMatch(/15\s?000/);
    expect(result).toMatch(/Kč/);
  });

  it("formats without decimal places", () => {
    const result = FormatTrainingPrice(15000);
    expect(result).not.toMatch(/,00/);
  });
});

describe("FormatTrainingDate", () => {
  it("formats ISO date string to Czech locale", () => {
    const result = FormatTrainingDate("2024-06-15");
    // Czech numeric format: "15. 6. 2024" or similar
    expect(result).toContain("15");
    expect(result).toContain("6");
    expect(result).toContain("2024");
  });
});
