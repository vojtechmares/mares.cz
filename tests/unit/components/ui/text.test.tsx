import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "../../../../src/components/ui/text";

describe("Text", () => {
  describe("rendering", () => {
    it("should render with children", () => {
      render(<Text>Text content</Text>);
      expect(screen.getByText("Text content")).toBeInTheDocument();
    });

    it("should render as p element", () => {
      render(<Text>Content</Text>);
      const element = screen.getByText("Content");
      expect(element.tagName).toBe("P");
    });
  });

  describe("variants", () => {
    it("should render with primary variant by default", () => {
      render(<Text>Primary</Text>);
      expect(screen.getByText("Primary")).toBeInTheDocument();
    });

    it("should render with secondary variant", () => {
      render(<Text variant="secondary">Secondary</Text>);
      expect(screen.getByText("Secondary")).toBeInTheDocument();
    });

    it("should render with muted variant", () => {
      render(<Text variant="muted">Muted</Text>);
      expect(screen.getByText("Muted")).toBeInTheDocument();
    });

    it("should render with inverse variant", () => {
      render(<Text variant="inverse">Inverse</Text>);
      expect(screen.getByText("Inverse")).toBeInTheDocument();
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(<Text className="custom-class">Custom</Text>);
      expect(screen.getByText("Custom")).toHaveClass("custom-class");
    });
  });

  describe("empty content", () => {
    it("should render without children", () => {
      const { container } = render(<Text />);
      expect(container.querySelector("p")).toBeInTheDocument();
    });
  });
});
