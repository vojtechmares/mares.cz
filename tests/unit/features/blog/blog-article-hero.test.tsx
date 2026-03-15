import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { BlogArticleHero } from "../../../../src/features/blog/blog-article-hero";

describe("BlogArticleHero", () => {
  const defaultProps = {
    title: "Deploying to Kubernetes",
    description: "A guide to Kubernetes deployments",
    publishDate: new Date("2024-06-15"),
    tags: ["kubernetes", "devops"],
    readingTimeMinutes: 5,
  };

  it("renders title and description", () => {
    render(<BlogArticleHero locale="cs" {...defaultProps} />);
    expect(screen.getByText("Deploying to Kubernetes")).toBeInTheDocument();
    expect(screen.getByText("A guide to Kubernetes deployments")).toBeInTheDocument();
  });

  it("renders formatted date in Czech locale", () => {
    render(<BlogArticleHero locale="cs" {...defaultProps} />);
    const formatted = new Date("2024-06-15").toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    expect(screen.getByText(formatted)).toBeInTheDocument();
  });

  it("renders tags as links", () => {
    render(<BlogArticleHero locale="cs" {...defaultProps} />);
    const k8sLink = screen.getByRole("link", { name: "#kubernetes" });
    expect(k8sLink).toHaveAttribute("href", "/blog/tag/kubernetes");
    const devopsLink = screen.getByRole("link", { name: "#devops" });
    expect(devopsLink).toHaveAttribute("href", "/blog/tag/devops");
  });

  it("renders 'témata článku' for multiple tags", () => {
    render(<BlogArticleHero locale="cs" {...defaultProps} />);
    expect(screen.getByText("témata článku")).toBeInTheDocument();
  });

  it("renders 'téma článku' for a single tag", () => {
    render(<BlogArticleHero locale="cs" {...defaultProps} tags={["kubernetes"]} />);
    expect(screen.getByText("téma článku")).toBeInTheDocument();
  });

  it("renders reading time with 'min' suffix", () => {
    render(<BlogArticleHero locale="cs" {...defaultProps} />);
    expect(screen.getByText("5 min")).toBeInTheDocument();
  });

  it("renders back to blog button", () => {
    render(<BlogArticleHero locale="cs" {...defaultProps} />);
    const link = screen.getByRole("link", { name: /zpět na blog/i });
    expect(link).toHaveAttribute("href", "/blog");
  });
});
