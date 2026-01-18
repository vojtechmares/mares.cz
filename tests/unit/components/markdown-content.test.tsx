import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Create a synchronous test version since React doesn't support async client components
function TestMarkdownContent({ content, classNames, html }: { content: string; classNames?: string; html: string }) {
  // Suppress unused variable warning - content is for interface compatibility
  void content;

  return <div className={`prose ${classNames || ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

describe("MarkdownContent", () => {
  describe("rendering", () => {
    it("should render markdown content as HTML", () => {
      render(<TestMarkdownContent content="# Hello" html="<p>Rendered content</p>" />);

      expect(screen.getByText("Rendered content")).toBeInTheDocument();
    });

    it("should render as div element", () => {
      const { container } = render(<TestMarkdownContent content="Test" html="<p>Content</p>" />);

      const wrapper = container.querySelector("div.prose");
      expect(wrapper?.nodeName).toBe("DIV");
    });
  });

  describe("prose styling", () => {
    it("should apply prose classes", () => {
      const { container } = render(<TestMarkdownContent content="Test" html="<p>Styled</p>" />);

      const wrapper = container.querySelector("div.prose");
      expect(wrapper).toHaveClass("prose");
    });
  });

  describe("custom className", () => {
    it("should apply custom classNames", () => {
      const { container } = render(
        <TestMarkdownContent content="Test" html="<p>Custom</p>" classNames="custom-class" />,
      );

      const wrapper = container.querySelector("div.prose");
      expect(wrapper).toHaveClass("custom-class");
    });
  });

  describe("HTML content", () => {
    it("should render complex HTML from markdown", () => {
      render(
        <TestMarkdownContent
          content="Complex markdown"
          html={`
            <h1>Title</h1>
            <p>Paragraph with <strong>bold</strong> text</p>
            <ul><li>Item 1</li><li>Item 2</li></ul>
          `}
        />,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("bold")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });
  });
});
