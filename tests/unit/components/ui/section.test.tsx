import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "../../../../src/components/ui/section";

describe("Section", () => {
  describe("rendering", () => {
    it("should render with children", () => {
      render(<Section>Section content</Section>);
      expect(screen.getByText("Section content")).toBeInTheDocument();
    });

    it("should render as section element", () => {
      render(<Section>Content</Section>);
      const section = screen.getByText("Content").closest("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("should render with default variant by default", () => {
      render(<Section>Default</Section>);
      const section = screen.getByText("Default").closest("section");
      expect(section).toBeInTheDocument();
    });

    it("should render with surface variant", () => {
      render(<Section variant="surface">Surface</Section>);
      const section = screen.getByText("Surface").closest("section");
      expect(section).toBeInTheDocument();
    });

    it("should render with inverse variant", () => {
      render(<Section variant="inverse">Inverse</Section>);
      const section = screen.getByText("Inverse").closest("section");
      expect(section).toBeInTheDocument();
    });

    it("should render with accent variant", () => {
      render(<Section variant="accent">Accent</Section>);
      const section = screen.getByText("Accent").closest("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("should render with md size by default", () => {
      render(<Section>Medium</Section>);
      const section = screen.getByText("Medium").closest("section");
      expect(section).toBeInTheDocument();
    });

    it("should render with sm size", () => {
      render(<Section size="sm">Small</Section>);
      const section = screen.getByText("Small").closest("section");
      expect(section).toBeInTheDocument();
    });

    it("should render with lg size", () => {
      render(<Section size="lg">Large</Section>);
      const section = screen.getByText("Large").closest("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should apply aria-label when provided", () => {
      render(<Section ariaLabel="Test section">Content</Section>);
      expect(screen.getByLabelText("Test section")).toBeInTheDocument();
    });

    it("should apply id when provided", () => {
      render(<Section id="test-id">Content</Section>);
      const section = screen.getByText("Content").closest("section");
      expect(section).toHaveAttribute("id", "test-id");
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(<Section className="custom-class">Custom</Section>);
      const section = screen.getByText("Custom").closest("section");
      expect(section).toHaveClass("custom-class");
    });
  });
});
