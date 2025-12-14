import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "../../../../src/components/ui/container";

describe("Container", () => {
  describe("rendering", () => {
    it("should render with children", () => {
      render(<Container>Container content</Container>);
      expect(screen.getByText("Container content")).toBeInTheDocument();
    });

    it("should render as div element", () => {
      render(<Container>Content</Container>);
      const container = screen.getByText("Content");
      expect(container.tagName).toBe("DIV");
    });

    it("should apply base layout styles", () => {
      render(<Container>Content</Container>);
      const container = screen.getByText("Content");
      expect(container).toHaveClass("mx-auto");
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(<Container className="custom-class">Custom</Container>);
      expect(screen.getByText("Custom")).toHaveClass("custom-class");
    });

    it("should merge custom className with base styles", () => {
      render(<Container className="my-custom">Content</Container>);
      const container = screen.getByText("Content");
      expect(container).toHaveClass("mx-auto", "my-custom");
    });
  });

  describe("nested content", () => {
    it("should render nested elements", () => {
      render(
        <Container>
          <h1>Title</h1>
          <p>Paragraph</p>
        </Container>,
      );
      expect(
        screen.getByRole("heading", { name: /title/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("Paragraph")).toBeInTheDocument();
    });
  });
});
