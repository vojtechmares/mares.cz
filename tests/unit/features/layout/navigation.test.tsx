import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Navigation } from "../../../../src/features/layout/navigation";

describe("Navigation", () => {
  const mockLinks = [
    { name: "Služby", href: "/sluzby" },
    { name: "Blog", href: "/blog" },
    { name: "Kontakt", href: "/kontakt" },
  ];

  describe("rendering", () => {
    it("should render navigation with brand name", () => {
      render(<Navigation locale="cs" links={mockLinks} />);
      expect(screen.getAllByText("Vojtěch Mareš").length).toBeGreaterThan(0);
    });

    it("should render as header element", () => {
      render(<Navigation locale="cs" links={mockLinks} />);
      expect(document.querySelector("header")).toBeInTheDocument();
    });

    it("should render navigation elements", () => {
      render(<Navigation locale="cs" links={mockLinks} />);
      const navElements = screen.getAllByRole("navigation");
      expect(navElements.length).toBeGreaterThan(0);
    });
  });

  describe("links", () => {
    it("should render all provided links", () => {
      render(<Navigation locale="cs" links={mockLinks} />);

      mockLinks.forEach((link) => {
        expect(screen.getAllByText(link.name).length).toBeGreaterThan(0);
      });
    });

    it("should render links with correct href attributes", () => {
      render(<Navigation locale="cs" links={mockLinks} />);

      mockLinks.forEach((link) => {
        const linkElements = screen.getAllByRole("link", { name: link.name });
        linkElements.forEach((linkElement) => {
          expect(linkElement).toHaveAttribute("href", link.href);
        });
      });
    });

    it("should render home link", () => {
      render(<Navigation locale="cs" links={mockLinks} />);
      const homeLinks = screen.getAllByRole("link", { name: /vojtěch mareš/i });
      homeLinks.forEach((homeLink) => {
        expect(homeLink).toHaveAttribute("href", "/");
      });
    });
  });

  describe("CTA button", () => {
    it("should render meeting CTA button", () => {
      render(<Navigation locale="cs" links={mockLinks} />);
      const ctaButtons = screen.getAllByRole("link", { name: /domluvme si schůzku/i });
      expect(ctaButtons.length).toBeGreaterThan(0);
      ctaButtons.forEach((button) => {
        expect(button).toHaveAttribute("href", "https://cal.com/vojtechmares/30min");
      });
    });
  });

  describe("responsive layouts", () => {
    it("should render mobile navigation", () => {
      const { container } = render(<Navigation locale="cs" links={mockLinks} />);
      // Mobile nav has lg:hidden class
      const navs = container.querySelectorAll("nav");
      expect(navs.length).toBe(2); // Mobile and desktop
    });

    it("should render desktop navigation", () => {
      const { container } = render(<Navigation locale="cs" links={mockLinks} />);
      const navs = container.querySelectorAll("nav");
      expect(navs.length).toBe(2); // Mobile and desktop
    });
  });

  describe("empty links", () => {
    it("should render with empty links array", () => {
      render(<Navigation locale="cs" links={[]} />);
      expect(screen.getAllByText("Vojtěch Mareš").length).toBeGreaterThan(0);
    });
  });
});
