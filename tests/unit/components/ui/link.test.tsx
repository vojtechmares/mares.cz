import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Link } from "../../../../src/components/ui/link";

describe("Link", () => {
  describe("rendering", () => {
    it("should render with children", () => {
      render(<Link href="/test">Link text</Link>);
      expect(screen.getByRole("link", { name: /link text/i })).toBeInTheDocument();
    });

    it("should render as anchor element", () => {
      render(<Link href="/test">Content</Link>);
      const link = screen.getByRole("link");
      expect(link.tagName).toBe("A");
    });

    it("should apply href attribute", () => {
      render(<Link href="/test-path">Link</Link>);
      expect(screen.getByRole("link")).toHaveAttribute("href", "/test-path");
    });
  });

  describe("variants", () => {
    it("should render with default variant by default", () => {
      render(<Link href="/test">Default</Link>);
      expect(screen.getByRole("link")).toBeInTheDocument();
    });

    it("should render with underline variant", () => {
      render(
        <Link href="/test" variant="underline">
          Underline
        </Link>,
      );
      const link = screen.getByRole("link");
      expect(link).toHaveClass("underline");
    });

    it("should render with muted variant", () => {
      render(
        <Link href="/test" variant="muted">
          Muted
        </Link>,
      );
      expect(screen.getByRole("link")).toBeInTheDocument();
    });
  });

  describe("external links", () => {
    it("should not have external attributes by default", () => {
      render(<Link href="/internal">Internal</Link>);
      const link = screen.getByRole("link");
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
    });

    it("should apply target=_blank for external links", () => {
      render(
        <Link href="https://example.com" external>
          External
        </Link>,
      );
      expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
    });

    it("should apply rel=noopener noreferrer for external links", () => {
      render(
        <Link href="https://example.com" external>
          External
        </Link>,
      );
      expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(
        <Link href="/test" className="custom-class">
          Custom
        </Link>,
      );
      expect(screen.getByRole("link")).toHaveClass("custom-class");
    });
  });
});
