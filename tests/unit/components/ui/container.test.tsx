import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

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
      expect(screen.getByRole("heading", { name: /title/i })).toBeInTheDocument();
      expect(screen.getByText("Paragraph")).toBeInTheDocument();
    });
  });

  describe("mode prop", () => {
    it("should apply standard max-width by default", () => {
      render(<Container>Content</Container>);
      const container = screen.getByText("Content");
      expect(container).toHaveClass("max-w-[1280px]");
    });

    it("should apply standard max-width when mode is default", () => {
      render(<Container mode="default">Content</Container>);
      const container = screen.getByText("Content");
      expect(container).toHaveClass("max-w-[1280px]");
    });

    it("should apply prose styles when mode is prose", () => {
      render(<Container mode="prose">Content</Container>);
      const container = screen.getByText("Content");
      expect(container).toHaveClass("max-w-prose", "md:text-lg", "lg:text-xl");
    });

    it("should work with custom className in prose mode", () => {
      render(
        <Container mode="prose" className="custom-class">
          Content
        </Container>,
      );
      const container = screen.getByText("Content");
      expect(container).toHaveClass("max-w-prose", "custom-class", "mx-auto");
    });
  });
});
