import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading } from "../../../../src/components/ui/heading";

describe("Heading", () => {
  describe("rendering", () => {
    it("should render with children", () => {
      render(<Heading>Heading text</Heading>);
      expect(screen.getByRole("heading", { name: /heading text/i })).toBeInTheDocument();
    });

    it("should render as h1 element by default", () => {
      render(<Heading>H1 Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("levels", () => {
    it("should render as h1", () => {
      render(<Heading level="h1">H1</Heading>);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("should render as h2", () => {
      render(<Heading level="h2">H2</Heading>);
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("should render as h3", () => {
      render(<Heading level="h3">H3</Heading>);
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
    });

    it("should render as h4", () => {
      render(<Heading level="h4">H4</Heading>);
      expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
    });

    it("should render as h5", () => {
      render(<Heading level="h5">H5</Heading>);
      expect(screen.getByRole("heading", { level: 5 })).toBeInTheDocument();
    });

    it("should render as h6", () => {
      render(<Heading level="h6">H6</Heading>);
      expect(screen.getByRole("heading", { level: 6 })).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("should render with primary variant by default", () => {
      render(<Heading>Primary</Heading>);
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });

    it("should render with inverse variant", () => {
      render(<Heading variant="inverse">Inverse</Heading>);
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });

    it("should render with accent variant", () => {
      render(<Heading variant="accent">Accent</Heading>);
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should apply aria-label when provided", () => {
      render(<Heading ariaLabel="Custom label">Visible text</Heading>);
      expect(screen.getByLabelText("Custom label")).toBeInTheDocument();
    });

    it("should apply id when provided", () => {
      render(<Heading id="test-id">Content</Heading>);
      expect(screen.getByRole("heading")).toHaveAttribute("id", "test-id");
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(<Heading className="custom-class">Custom</Heading>);
      expect(screen.getByRole("heading")).toHaveClass("custom-class");
    });
  });
});
