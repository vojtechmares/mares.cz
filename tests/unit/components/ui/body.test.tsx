import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Body } from "../../../../src/components/ui/body";

describe("Body", () => {
  describe("rendering", () => {
    it("should render with children", () => {
      render(<Body>Body text</Body>);
      expect(screen.getByText("Body text")).toBeInTheDocument();
    });

    it("should render as p element by default", () => {
      render(<Body>Content</Body>);
      const element = screen.getByText("Content");
      expect(element.tagName).toBe("P");
    });
  });

  describe("as prop (polymorphic)", () => {
    it("should render as span when as=span", () => {
      render(<Body as="span">Span content</Body>);
      const element = screen.getByText("Span content");
      expect(element.tagName).toBe("SPAN");
    });

    it("should render as div when as=div", () => {
      render(<Body as="div">Div content</Body>);
      const element = screen.getByText("Div content");
      expect(element.tagName).toBe("DIV");
    });

    it("should render as p when as=p", () => {
      render(<Body as="p">P content</Body>);
      const element = screen.getByText("P content");
      expect(element.tagName).toBe("P");
    });
  });

  describe("color variants", () => {
    it("should render with primary color by default", () => {
      render(<Body>Primary</Body>);
      expect(screen.getByText("Primary")).toBeInTheDocument();
    });

    it("should render with secondary color", () => {
      render(<Body color="secondary">Secondary</Body>);
      expect(screen.getByText("Secondary")).toBeInTheDocument();
    });

    it("should render with muted color", () => {
      render(<Body color="muted">Muted</Body>);
      expect(screen.getByText("Muted")).toBeInTheDocument();
    });

    it("should render with inverse color", () => {
      render(<Body color="inverse">Inverse</Body>);
      expect(screen.getByText("Inverse")).toBeInTheDocument();
    });
  });

  describe("size variants", () => {
    it("should render with base variant by default", () => {
      render(<Body>Base</Body>);
      expect(screen.getByText("Base")).toBeInTheDocument();
    });

    it("should render with sm variant", () => {
      render(<Body variant="sm">Small</Body>);
      expect(screen.getByText("Small")).toBeInTheDocument();
    });

    it("should render with lg variant", () => {
      render(<Body variant="lg">Large</Body>);
      expect(screen.getByText("Large")).toBeInTheDocument();
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(<Body className="custom-class">Custom</Body>);
      expect(screen.getByText("Custom")).toHaveClass("custom-class");
    });
  });
});
