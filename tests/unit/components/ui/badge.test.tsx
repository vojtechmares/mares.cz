import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Badge } from "../../../../src/components/ui/badge";

describe("Badge", () => {
  describe("rendering", () => {
    it("should render with children", () => {
      render(<Badge>Badge text</Badge>);
      expect(screen.getByText("Badge text")).toBeInTheDocument();
    });

    it("should render as span element by default", () => {
      render(<Badge>Content</Badge>);
      const element = screen.getByText("Content");
      expect(element.tagName).toBe("SPAN");
    });

    it("should apply base styles", () => {
      render(<Badge>Styled</Badge>);
      const element = screen.getByText("Styled");
      expect(element).toHaveClass("inline-block", "px-4", "py-2", "font-bold");
    });
  });

  describe("as prop (polymorphic)", () => {
    it("should render as link when as=a and href is provided", () => {
      render(
        <Badge as="a" href="/test">
          Link Badge
        </Badge>,
      );
      const link = screen.getByRole("link", { name: /link badge/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });

    it("should render as span when as=a but no href", () => {
      render(<Badge as="a">No href</Badge>);
      const element = screen.getByText("No href");
      expect(element.tagName).toBe("SPAN");
    });

    it("should render as span when as=span", () => {
      render(<Badge as="span">Span Badge</Badge>);
      const element = screen.getByText("Span Badge");
      expect(element.tagName).toBe("SPAN");
    });
  });

  describe("variants", () => {
    it("should render with default variant by default", () => {
      render(<Badge>Default</Badge>);
      expect(screen.getByText("Default")).toBeInTheDocument();
    });

    it("should render with accent variant", () => {
      render(<Badge variant="accent">Accent</Badge>);
      expect(screen.getByText("Accent")).toBeInTheDocument();
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(<Badge className="custom-class">Custom</Badge>);
      expect(screen.getByText("Custom")).toHaveClass("custom-class");
    });
  });
});
