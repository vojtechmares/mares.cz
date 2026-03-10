import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ArticleGrid } from "../../../../src/features/blog/article-grid";

const createMockArticle = (overrides: Record<string, unknown> = {}) => ({
  id: "my-article",
  collection: "blog" as const,
  data: {
    title: "Test Article",
    description: "A short description",
    tags: ["docker"],
    publish_time: new Date("2024-06-01"),
    draft: false,
    ...((overrides.data as Record<string, unknown>) ?? {}),
  },
  ...Object.fromEntries(Object.entries(overrides).filter(([k]) => k !== "data")),
});

describe("ArticleGrid", () => {
  it("renders article cards with title, tags, date and description", () => {
    const articles = [createMockArticle()];
    render(<ArticleGrid articles={articles as any} />);
    expect(screen.getByText("Test Article")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "#docker" })).toHaveAttribute("href", "/blog/tag/docker");
    expect(screen.getByText("A short description")).toBeInTheDocument();
  });

  it("truncates descriptions longer than 120 characters", () => {
    const longDesc = "A".repeat(150);
    const articles = [createMockArticle({ data: { description: longDesc } })];
    render(<ArticleGrid articles={articles as any} />);
    expect(screen.getByText("A".repeat(120) + "…")).toBeInTheDocument();
  });

  it("does not truncate descriptions of 120 chars or fewer", () => {
    const shortDesc = "A".repeat(120);
    const articles = [createMockArticle({ data: { description: shortDesc } })];
    render(<ArticleGrid articles={articles as any} />);
    expect(screen.getByText(shortDesc)).toBeInTheDocument();
  });

  it("links to correct article URLs", () => {
    const articles = [createMockArticle({ id: "my-post" })];
    render(<ArticleGrid articles={articles as any} />);
    const link = screen.getByRole("link", { name: /přečíst si článek/i });
    expect(link).toHaveAttribute("href", "/blog/my-post");
  });

  it("renders multiple articles", () => {
    const articles = [
      createMockArticle({ id: "post-1", data: { title: "First" } }),
      createMockArticle({ id: "post-2", data: { title: "Second" } }),
    ];
    render(<ArticleGrid articles={articles as any} />);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
