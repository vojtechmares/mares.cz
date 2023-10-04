import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Home from "../pages";

test("home", () => {
  render(<Home />);
  const main = within(screen.getByRole("main"));
  expect(
    main.getByRole("heading", {
      level: 1,
      name: /Jsem Vojtěch Mareš a pomohu Vám s Vaší IT infrastrukturou./i,
    })
  ).toBeDefined();

  const writeMe = screen.getAllByText(/Napište mi/i);

  writeMe.map((element) => {
    // First button (in navbar) is <a><span>...</span></a>, therefore we look for parent (closest) anchor element
    if (element instanceof HTMLSpanElement) {
      const parent = element.closest("a");
      expect(parent?.getAttribute("href")).toBe(
        "mailto:iam@vojtechmares.com"
      )
      return;
    }

    expect(element.getAttribute("href")).toBe(
      "mailto:iam@vojtechmares.com"
    )
  });


  expect(writeMe).toHaveLength(6);

  // const footer = within(screen.getByRole('contentinfo'))
  // const link = within(footer.getByRole('link'))
  // expect(link.getByRole('img', { name: /vercel logo/i })).toBeDefined()
});
