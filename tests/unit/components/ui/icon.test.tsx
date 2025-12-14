import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Icon } from "../../../../src/components/ui/icon";

describe("Icon", () => {
  describe("rendering", () => {
    it("should render with children", () => {
      render(
        <Icon>
          <svg data-testid="icon-svg" />
        </Icon>,
      );
      expect(screen.getByTestId("icon-svg")).toBeInTheDocument();
    });

    it("should render as span element", () => {
      render(
        <Icon>
          <svg data-testid="icon-svg" />
        </Icon>,
      );
      const container = screen.getByTestId("icon-svg").parentElement;
      expect(container?.tagName).toBe("SPAN");
    });

    it("should apply base styles", () => {
      render(
        <Icon>
          <svg data-testid="icon-svg" />
        </Icon>,
      );
      const container = screen.getByTestId("icon-svg").parentElement;
      expect(container).toHaveClass(
        "inline-flex",
        "items-center",
        "justify-center",
      );
    });
  });

  describe("sizes", () => {
    it("should render with md size by default", () => {
      render(
        <Icon>
          <svg data-testid="icon-svg" />
        </Icon>,
      );
      const container = screen.getByTestId("icon-svg").parentElement;
      expect(container).toHaveClass("h-6", "w-6");
    });

    it("should render with sm size", () => {
      render(
        <Icon size="sm">
          <svg data-testid="icon-svg" />
        </Icon>,
      );
      const container = screen.getByTestId("icon-svg").parentElement;
      expect(container).toHaveClass("h-4", "w-4");
    });

    it("should render with lg size", () => {
      render(
        <Icon size="lg">
          <svg data-testid="icon-svg" />
        </Icon>,
      );
      const container = screen.getByTestId("icon-svg").parentElement;
      expect(container).toHaveClass("h-8", "w-8");
    });
  });

  describe("accessibility", () => {
    it("should have role=img when label is provided", () => {
      render(
        <Icon label="Settings icon">
          <svg data-testid="icon-svg" />
        </Icon>,
      );
      expect(
        screen.getByRole("img", { name: /settings icon/i }),
      ).toBeInTheDocument();
    });

    it("should not have role when label is not provided", () => {
      render(
        <Icon>
          <svg data-testid="icon-svg" />
        </Icon>,
      );
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("should apply aria-label when label is provided", () => {
      render(
        <Icon label="Menu icon">
          <svg data-testid="icon-svg" />
        </Icon>,
      );
      const container = screen.getByRole("img");
      expect(container).toHaveAttribute("aria-label", "Menu icon");
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(
        <Icon className="custom-class">
          <svg data-testid="icon-svg" />
        </Icon>,
      );
      const container = screen.getByTestId("icon-svg").parentElement;
      expect(container).toHaveClass("custom-class");
    });
  });
});
