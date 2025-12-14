import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleHeader } from "../../../../src/features/blog/article-header";

describe("ArticleHeader", () => {
  const createArticle = (publishedAt: Date, updatedAt: Date) => ({
    title: "Test Article",
    slug: "test-article",
    text: "Article content",
    description: "Description",
    publishedAt,
    updatedAt,
  });

  describe("rendering", () => {
    it("should render as header element", () => {
      const article = createArticle(
        new Date("2024-01-15"),
        new Date("2024-01-15"),
      );

      render(<ArticleHeader article={article} />);

      expect(document.querySelector("header")).toBeInTheDocument();
    });

    it("should render published date", () => {
      const article = createArticle(
        new Date("2024-01-15"),
        new Date("2024-01-15"),
      );

      render(<ArticleHeader article={article} />);

      // Czech date format: "15. ledna 2024"
      expect(screen.getByText(/15\. ledna 2024/i)).toBeInTheDocument();
    });
  });

  describe("updated date", () => {
    it("should show updated date when different from published", () => {
      const article = createArticle(
        new Date("2024-01-15"),
        new Date("2024-01-20"),
      );

      render(<ArticleHeader article={article} />);

      expect(screen.getByText(/upraveno:/i)).toBeInTheDocument();
      expect(screen.getByText(/20\. ledna 2024/i)).toBeInTheDocument();
    });

    it("should not show updated date when same as published", () => {
      const article = createArticle(
        new Date("2024-01-15"),
        new Date("2024-01-15"),
      );

      render(<ArticleHeader article={article} />);

      expect(screen.queryByText(/upraveno:/i)).not.toBeInTheDocument();
    });

    it("should show updated date for different days in same month", () => {
      const article = createArticle(
        new Date("2024-03-10"),
        new Date("2024-03-15"),
      );

      render(<ArticleHeader article={article} />);

      expect(screen.getByText(/upraveno:/i)).toBeInTheDocument();
    });

    it("should show updated date for different months", () => {
      const article = createArticle(
        new Date("2024-01-15"),
        new Date("2024-02-20"),
      );

      render(<ArticleHeader article={article} />);

      expect(screen.getByText(/upraveno:/i)).toBeInTheDocument();
      expect(screen.getByText(/února/i)).toBeInTheDocument();
    });
  });

  describe("date formatting", () => {
    it("should format dates in Czech locale", () => {
      const article = createArticle(
        new Date("2024-06-25"),
        new Date("2024-06-25"),
      );

      render(<ArticleHeader article={article} />);

      // Czech month names
      expect(screen.getByText(/června/i)).toBeInTheDocument();
    });

    it("should show day, month, and year", () => {
      const article = createArticle(
        new Date("2024-12-31"),
        new Date("2024-12-31"),
      );

      render(<ArticleHeader article={article} />);

      expect(screen.getByText(/31\. prosince 2024/i)).toBeInTheDocument();
    });
  });

  describe("undefined dates", () => {
    it("should handle undefined publishedAt", () => {
      const article = {
        title: "Test",
        slug: "test",
        text: "Content",
        description: "Desc",
        publishedAt: undefined,
        updatedAt: undefined,
      };

      render(<ArticleHeader article={article} />);

      // Should render without errors
      expect(document.querySelector("header")).toBeInTheDocument();
    });
  });
});
