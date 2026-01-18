import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Stack } from "../../../../src/components/ui/stack";

describe("Stack", () => {
  describe("rendering", () => {
    it("should render with children", () => {
      render(
        <Stack>
          <span>Child 1</span>
          <span>Child 2</span>
        </Stack>,
      );
      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
    });

    it("should render as div element", () => {
      render(
        <Stack>
          <span>Content</span>
        </Stack>,
      );
      const container = screen.getByText("Content").parentElement;
      expect(container?.tagName).toBe("DIV");
    });
  });

  describe("direction", () => {
    it("should render with vertical direction by default", () => {
      render(
        <Stack>
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("flex", "flex-col");
    });

    it("should render with horizontal direction", () => {
      render(
        <Stack direction="horizontal">
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("flex", "flex-row");
    });
  });

  describe("alignment", () => {
    it("should apply align=start", () => {
      render(
        <Stack align="start">
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("items-start");
    });

    it("should apply align=center", () => {
      render(
        <Stack align="center">
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("items-center");
    });

    it("should apply align=end", () => {
      render(
        <Stack align="end">
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("items-end");
    });

    it("should apply align=stretch", () => {
      render(
        <Stack align="stretch">
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("items-stretch");
    });
  });

  describe("justify", () => {
    it("should apply justify=start", () => {
      render(
        <Stack justify="start">
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("justify-start");
    });

    it("should apply justify=center", () => {
      render(
        <Stack justify="center">
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("justify-center");
    });

    it("should apply justify=end", () => {
      render(
        <Stack justify="end">
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("justify-end");
    });

    it("should apply justify=between", () => {
      render(
        <Stack justify="between">
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("justify-between");
    });

    it("should apply justify=around", () => {
      render(
        <Stack justify="around">
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("justify-around");
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(
        <Stack className="custom-class">
          <span>Item</span>
        </Stack>,
      );
      const container = screen.getByText("Item").parentElement;
      expect(container).toHaveClass("custom-class");
    });
  });
});
