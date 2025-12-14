import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Logo } from "../../../../src/features/training/logo";

describe("Logo", () => {
  describe("image source priority", () => {
    it("should use small format when available", () => {
      const training = {
        logo: {
          formats: {
            small: { url: "/images/small.png" },
            thumbnail: { url: "/images/thumbnail.png" },
          },
        },
        icon: { url: "/icons/icon.svg" },
      } as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveAttribute("src", "/images/small.png");
    });

    it("should use thumbnail format when small is not available", () => {
      const training = {
        logo: {
          formats: {
            thumbnail: { url: "/images/thumbnail.png" },
          },
        },
        icon: { url: "/icons/icon.svg" },
      } as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveAttribute("src", "/images/thumbnail.png");
    });

    it("should use icon as fallback when logo formats are not available", () => {
      const training = {
        logo: {
          formats: {},
        },
        icon: { url: "/icons/icon.svg" },
      } as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveAttribute("src", "/icons/icon.svg");
    });

    it("should use icon when logo is undefined", () => {
      const training = {
        logo: undefined,
        icon: { url: "/icons/icon.svg" },
      } as unknown as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveAttribute("src", "/icons/icon.svg");
    });
  });

  describe("when no image available", () => {
    it("should render empty fragment when all image sources are undefined", () => {
      const training = {
        logo: undefined,
        icon: undefined,
      } as unknown as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);

      expect(container.firstChild).toBeNull();
    });

    it("should render empty fragment when logo formats are empty and no icon", () => {
      const training = {
        logo: {
          formats: {},
        },
        icon: undefined,
      } as unknown as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("styling", () => {
    it("should apply invert class for SVG icons", () => {
      const training = {
        logo: {
          formats: {},
        },
        icon: { url: "/icons/icon.svg" },
      } as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveClass("invert");
    });

    it("should not apply invert class for non-SVG images", () => {
      const training = {
        logo: {
          formats: {
            small: { url: "/images/logo.png" },
          },
        },
      } as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).not.toHaveClass("invert");
    });

    it("should apply base size class", () => {
      const training = {
        logo: {
          formats: {
            small: { url: "/images/logo.png" },
          },
        },
      } as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveClass("h-32", "w-auto");
    });
  });

  describe("image attributes", () => {
    it("should have empty alt text", () => {
      const training = {
        logo: {
          formats: {
            small: { url: "/images/logo.png" },
          },
        },
      } as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveAttribute("alt", "");
    });

    it("should have width and height attributes", () => {
      const training = {
        logo: {
          formats: {
            small: { url: "/images/logo.png" },
          },
        },
      } as Parameters<typeof Logo>[0]["training"];

      const { container } = render(<Logo training={training} />);
      const img = container.querySelector("img");

      expect(img).toHaveAttribute("width", "100");
      expect(img).toHaveAttribute("height", "100");
    });
  });
});
