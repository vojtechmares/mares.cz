import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Card } from "../../../../src/components/ui/card";

describe("Card", () => {
  describe("rendering", () => {
    it("should render with children", () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("should render as section element", () => {
      render(<Card>Content</Card>);
      const section = screen.getByText("Content").closest("section");
      expect(section).toBeInTheDocument();
    });

    it("should apply base styles", () => {
      render(<Card>Styled</Card>);
      const section = screen.getByText("Styled").closest("section");
      expect(section).toHaveClass("overflow-hidden");
    });
  });

  describe("variants", () => {
    it("should render with default variant by default", () => {
      render(<Card>Default</Card>);
      const section = screen.getByText("Default").closest("section");
      expect(section).toBeInTheDocument();
    });

    it("should render with surface variant", () => {
      render(<Card variant="surface">Surface</Card>);
      const section = screen.getByText("Surface").closest("section");
      expect(section).toBeInTheDocument();
    });

    it("should render with inverse variant", () => {
      render(<Card variant="inverse">Inverse</Card>);
      const section = screen.getByText("Inverse").closest("section");
      expect(section).toBeInTheDocument();
    });

    it("should render with accent variant", () => {
      render(<Card variant="accent">Accent</Card>);
      const section = screen.getByText("Accent").closest("section");
      expect(section).toBeInTheDocument();
    });

    it("should render with accent-light variant", () => {
      render(<Card variant="accent-light">Accent Light</Card>);
      const section = screen.getByText("Accent Light").closest("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("border", () => {
    it("should apply border=none by default", () => {
      render(<Card>No border</Card>);
      const section = screen.getByText("No border").closest("section");
      expect(section).toHaveClass("border-none");
    });
  });

  describe("shadow", () => {
    it("should not apply shadow by default", () => {
      render(<Card>No shadow</Card>);
      const section = screen.getByText("No shadow").closest("section");
      expect(section).not.toHaveClass("shadow-md");
    });

    it("should apply shadow when shadow=true", () => {
      render(<Card shadow={true}>With shadow</Card>);
      const section = screen.getByText("With shadow").closest("section");
      expect(section).toHaveClass("shadow-md");
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(<Card className="custom-class">Custom</Card>);
      const section = screen.getByText("Custom").closest("section");
      expect(section).toHaveClass("custom-class");
    });
  });
});
