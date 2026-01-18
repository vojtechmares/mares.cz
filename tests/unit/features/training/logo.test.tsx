import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Logo } from "../../../../src/features/training/logo";

describe("Logo", () => {
  describe("image source priority", () => {
    it("should use logo when available", () => {
      const training = {
        id: "test-training",
        data: {
          logo: { src: "/images/logo.png" },
          icon: { src: "/icons/icon.svg" },
        },
      } as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveAttribute("src", "/images/logo.png");
    });

    it("should use icon as fallback when logo is not available", () => {
      const training = {
        id: "test-training",
        data: {
          logo: undefined,
          icon: { src: "/icons/icon.svg" },
        },
      } as unknown as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveAttribute("src", "/icons/icon.svg");
    });
  });

  describe("when no image available", () => {
    it("should render empty fragment when all image sources are undefined", () => {
      const training = {
        id: "test-training",
        data: {
          logo: undefined,
          icon: undefined,
        },
      } as unknown as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("styling", () => {
    it("should apply invert class for SVG icons", () => {
      const training = {
        id: "test-training",
        data: {
          logo: undefined,
          icon: { src: "/icons/icon.svg" },
        },
      } as unknown as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveClass("invert");
    });

    it("should not apply invert class for non-SVG images", () => {
      const training = {
        id: "test-training",
        data: {
          logo: { src: "/images/logo.png" },
        },
      } as unknown as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).not.toHaveClass("invert");
    });

    it("should apply base size class", () => {
      const training = {
        id: "test-training",
        data: {
          logo: { src: "/images/logo.png" },
        },
      } as unknown as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveClass("h-32", "w-auto");
    });
  });

  describe("image attributes", () => {
    it("should have empty alt text", () => {
      const training = {
        id: "test-training",
        data: {
          logo: { src: "/images/logo.png" },
        },
      } as unknown as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveAttribute("alt", "");
    });

    it("should have width and height attributes", () => {
      const training = {
        id: "test-training",
        data: {
          logo: { src: "/images/logo.png" },
        },
      } as unknown as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveAttribute("width", "100");
      expect(img).toHaveAttribute("height", "100");
    });
  });
});
