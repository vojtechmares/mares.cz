import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Page from "../app/page";

test("homepage", () => {
  render(<Page />);
  const main = within(screen.getByRole("main"));
  expect(
    main.getByRole("heading", {
      level: 1,
      name: /Jsem Vojtěch Mareš a pomohu Vám s Vaší IT infrastrukturou./i,
    }),
  ).toBeDefined();

  const writeMe = screen.getAllByText(/Napište mi/i);

  writeMe.map((element) => {
    // First button (in navbar) is <a><span>...</span></a>, therefore we look for parent (closest) anchor element
    if (element instanceof HTMLSpanElement) {
      const parent = element.closest("a");
      expect(parent?.getAttribute("href")).toBe("mailto:jsem@vojtechmares.com");
      return;
    }

    expect(element.getAttribute("href")).toBe("mailto:jsem@vojtechmares.com");
  });

  expect(writeMe).toHaveLength(2);

  // const footer = within(screen.getByRole('contentinfo'))
  // const link = within(footer.getByRole('link'))
  // expect(link.getByRole('img', { name: /vercel logo/i })).toBeDefined()
});
