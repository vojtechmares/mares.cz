import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../../../../src/components/ui/button";

describe("Button", () => {
  describe("rendering", () => {
    it("should render with children", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("should render as button element by default", () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render as link when href is provided", () => {
      render(<Button href="/test">Link</Button>);
      expect(screen.getByRole("link", { name: /link/i })).toHaveAttribute("href", "/test");
    });

    it("should apply type attribute to link", () => {
      render(
        <Button href="/feed.xml" type="application/rss+xml">
          RSS
        </Button>,
      );
      expect(screen.getByRole("link")).toHaveAttribute("type", "application/rss+xml");
    });
  });

  describe("styles", () => {
    it("should render with solid style by default", () => {
      render(<Button>Solid</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-none");
    });

    it("should render with outline style", () => {
      render(<Button style="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("ring-1");
    });
  });

  describe("variants", () => {
    it("should render with primary variant by default", () => {
      render(<Button>Primary</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render with secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render with accent variant (solid)", () => {
      render(<Button variant="accent">Accent</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render outline with primary variant", () => {
      render(
        <Button style="outline" variant="primary">
          Outline Primary
        </Button>,
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render outline with secondary variant", () => {
      render(
        <Button style="outline" variant="secondary">
          Outline Secondary
        </Button>,
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("should render with large size by default", () => {
      render(<Button>Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-8", "py-4", "text-base");
    });

    it("should render with medium size", () => {
      render(<Button size="medium">Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-4", "py-2", "text-sm");
    });
  });

  describe("interactions", () => {
    it("should call onClick handler when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("error handling", () => {
    it("should throw error for outline accent variant", () => {
      expect(() =>
        render(
          <Button style="outline" variant="accent">
            Invalid
          </Button>,
        ),
      ).toThrow("Outline buttons cannot be accent");
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });
  });
});
