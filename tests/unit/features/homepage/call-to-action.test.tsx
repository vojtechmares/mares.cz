import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CallToAction } from "../../../../src/features/homepage/call-to-action";

describe("CallToAction", () => {
  describe("rendering", () => {
    it("should render section with correct id", () => {
      render(<CallToAction />);
      expect(document.getElementById("pojdme-do-toho")).toBeInTheDocument();
    });

    it("should render main heading", () => {
      render(<CallToAction />);
      expect(
        screen.getByRole("heading", {
          name: /pojďme do toho společně/i,
          level: 2,
        }),
      ).toBeInTheDocument();
    });

    it("should render description text", () => {
      render(<CallToAction />);
      expect(screen.getByText(/nastal čas posunout vaši infrastrukturu/i)).toBeInTheDocument();
    });

    it("should render motivational text", () => {
      render(<CallToAction />);
      expect(
        screen.getByText(/infrastruktura má vaši aplikaci představit světu/i),
      ).toBeInTheDocument();
    });
  });

  describe("CTA button", () => {
    it("should render meeting booking button", () => {
      render(<CallToAction />);
      expect(screen.getByRole("link", { name: /domluvme si schůzku/i })).toHaveAttribute(
        "href",
        "https://cal.com/vojtechmares/30min",
      );
    });

    it("should have accent variant button", () => {
      render(<CallToAction />);
      const button = screen.getByRole("link", { name: /domluvme si schůzku/i });
      // Accent button has amber background color
      expect(button).toBeInTheDocument();
    });

    it("should have large size button", () => {
      render(<CallToAction />);
      const button = screen.getByRole("link", { name: /domluvme si schůzku/i });
      expect(button).toHaveClass("px-8", "py-4");
    });
  });

  describe("layout", () => {
    it("should be centered", () => {
      const { container } = render(<CallToAction />);
      const centerWrapper = container.querySelector(".text-center");
      expect(centerWrapper).toBeInTheDocument();
    });

    it("should have max-width constraint", () => {
      const { container } = render(<CallToAction />);
      const wrapper = container.querySelector(".max-w-xl");
      expect(wrapper).toBeInTheDocument();
    });
  });
});
