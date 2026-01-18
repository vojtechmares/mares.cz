import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Hero } from "../../../../src/features/homepage/hero";

describe("Hero", () => {
  describe("rendering", () => {
    it("should render main heading with name", () => {
      render(<Hero />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/vojtěch mareš/i)).toBeInTheDocument();
    });

    it("should render DevOps architect title", () => {
      render(<Hero />);
      expect(screen.getByText(/devops architekt/i)).toBeInTheDocument();
    });

    it("should render description paragraph", () => {
      render(<Hero />);
      expect(screen.getByText(/snížíme vaše náklady na infrastrukturu/i)).toBeInTheDocument();
    });
  });

  describe("CTA buttons", () => {
    it("should render meeting booking button", () => {
      render(<Hero />);
      expect(screen.getByRole("link", { name: /domluvme si schůzku/i })).toHaveAttribute(
        "href",
        "https://cal.com/vojtechmares/30min",
      );
    });
  });

  describe("children", () => {
    it("should render children", () => {
      render(
        <Hero>
          <div data-testid="hero-child">Child content</div>
        </Hero>,
      );
      expect(screen.getByTestId("hero-child")).toBeInTheDocument();
      expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("should render without children", () => {
      render(<Hero />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });

  describe("decorative elements", () => {
    it("should have decorative SVG underline", () => {
      const { container } = render(<Hero />);
      const svg = container.querySelector('svg[aria-hidden="true"]');
      expect(svg).toBeInTheDocument();
    });
  });
});
