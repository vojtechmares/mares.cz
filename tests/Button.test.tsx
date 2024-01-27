import { expect, test } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Button } from "@/components/Button";

test("button", () => {
  render(<Button>Hello</Button>);

  expect(screen.getByText("Hello")).toBeDefined();

  cleanup();
});

test("button-with-link", () => {
  render(<Button href="/country-road">Hello</Button>);

  expect(screen.getByText("Hello").getAttribute("href")).toBe("/country-road");

  cleanup();
});
