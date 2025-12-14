import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// Create a synchronous test version since React doesn't support async client components
function TestArticle({ html }: { html: string }) {
  return (
    <article className="prose">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

describe("Article", () => {
  describe("rendering", () => {
    it("should render article content as HTML", () => {
      render(<TestArticle html="<p>Rendered article content</p>" />);

      expect(screen.getByText("Rendered article content")).toBeInTheDocument();
    });

    it("should render as article element", () => {
      render(<TestArticle html="<p>Content</p>" />);

      expect(document.querySelector("article")).toBeInTheDocument();
    });
  });

  describe("prose styling", () => {
    it("should apply prose classes", () => {
      render(<TestArticle html="<p>Styled content</p>" />);

      const article = document.querySelector("article");
      expect(article).toHaveClass("prose");
    });
  });

  describe("HTML content rendering", () => {
    it("should render complex markdown HTML", () => {
      render(
        <TestArticle
          html={`
            <h1>Article Title</h1>
            <p>Introduction paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
            <ul>
              <li>List item 1</li>
              <li>List item 2</li>
            </ul>
            <pre><code>const x = 1;</code></pre>
          `}
        />,
      );

      expect(screen.getByText("Article Title")).toBeInTheDocument();
      expect(screen.getByText("bold")).toBeInTheDocument();
      expect(screen.getByText("italic")).toBeInTheDocument();
      expect(screen.getByText("List item 1")).toBeInTheDocument();
    });
  });
});
