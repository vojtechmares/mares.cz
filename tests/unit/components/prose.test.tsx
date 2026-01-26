import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Prose } from "../../../src/components/prose";

describe("Prose", () => {
  describe("rendering with children", () => {
    it("should render children content", () => {
      render(
        <Prose>
          <p>Hello world</p>
        </Prose>,
      );

      expect(screen.getByText("Hello world")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <Prose>
          <h1>Title</h1>
          <p>Paragraph</p>
        </Prose>,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Paragraph")).toBeInTheDocument();
    });

    it("should render text children", () => {
      render(<Prose>Plain text content</Prose>);

      expect(screen.getByText("Plain text content")).toBeInTheDocument();
    });
  });

  describe("element structure", () => {
    it("should render as div element with children", () => {
      const { container } = render(
        <Prose>
          <p>Content</p>
        </Prose>,
      );

      const wrapper = container.querySelector("div.prose");
      expect(wrapper?.nodeName).toBe("DIV");
    });
  });

  describe("prose styling", () => {
    it("should apply prose class with children", () => {
      const { container } = render(
        <Prose>
          <p>Styled</p>
        </Prose>,
      );

      const wrapper = container.querySelector("div.prose");
      expect(wrapper).toHaveClass("prose");
    });

    it("should apply responsive prose classes", () => {
      const { container } = render(
        <Prose>
          <p>Content</p>
        </Prose>,
      );

      const wrapper = container.querySelector("div.prose");
      expect(wrapper).toHaveClass("md:prose-lg");
      expect(wrapper).toHaveClass("lg:prose-xl");
    });

    it("should apply typography customization classes", () => {
      const { container } = render(
        <Prose>
          <p>Content</p>
        </Prose>,
      );

      const wrapper = container.querySelector("div.prose");
      expect(wrapper).toHaveClass("prose-h1:font-extrabold");
      expect(wrapper).toHaveClass("prose-a:text-orange-800");
    });
  });

  describe("custom className", () => {
    it("should apply custom className with children", () => {
      const { container } = render(
        <Prose className="custom-class">
          <p>Content</p>
        </Prose>,
      );

      const wrapper = container.querySelector("div.prose");
      expect(wrapper).toHaveClass("custom-class");
    });

    it("should merge custom className with prose classes", () => {
      const { container } = render(
        <Prose className="my-custom-class">
          <p>Content</p>
        </Prose>,
      );

      const wrapper = container.querySelector("div.prose");
      expect(wrapper).toHaveClass("prose");
      expect(wrapper).toHaveClass("my-custom-class");
    });

    it("should handle multiple custom classes", () => {
      const { container } = render(
        <Prose className="class-one class-two">
          <p>Content</p>
        </Prose>,
      );

      const wrapper = container.querySelector("div.prose");
      expect(wrapper).toHaveClass("class-one");
      expect(wrapper).toHaveClass("class-two");
    });
  });

  describe("layout classes", () => {
    it("should apply horizontal padding classes", () => {
      const { container } = render(
        <Prose>
          <p>Content</p>
        </Prose>,
      );

      const wrapper = container.querySelector("div.prose");
      expect(wrapper).toHaveClass("px-4");
      expect(wrapper).toHaveClass("md:px-0");
    });

    it("should apply centering class", () => {
      const { container } = render(
        <Prose>
          <p>Content</p>
        </Prose>,
      );

      const wrapper = container.querySelector("div.prose");
      expect(wrapper).toHaveClass("mx-auto");
    });
  });
});
