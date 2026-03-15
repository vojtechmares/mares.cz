import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Error } from "../../../../src/features/error/error";

describe("Error", () => {
  it("shows 'Page Not Found' for 404 status", () => {
    render(<Error locale="cs" status={404} />);
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByText(/stránka kterou hledáte/)).toBeInTheDocument();
  });

  it("shows 'Internal Server Error' for 500 status", () => {
    render(<Error locale="cs" status={500} />);
    expect(screen.getByText("Internal Server Error")).toBeInTheDocument();
    expect(screen.getByText(/něco se rozbilo/)).toBeInTheDocument();
  });

  it("defaults to 500 messages for unknown status", () => {
    render(<Error locale="cs" status={503} />);
    expect(screen.getByText("Internal Server Error")).toBeInTheDocument();
  });

  it("renders error prop when provided", () => {
    render(<Error locale="cs" status={500} error="Connection timeout" />);
    expect(screen.getByText("Connection timeout")).toBeInTheDocument();
  });

  it("does not render error text when error prop is undefined", () => {
    const { container } = render(<Error locale="cs" status={500} />);
    const texts = container.querySelectorAll("p");
    const textContents = Array.from(texts).map((t) => t.textContent);
    expect(textContents).not.toContain("Connection timeout");
  });

  it("renders link back to homepage", () => {
    render(<Error locale="cs" status={404} />);
    const link = screen.getByRole("link", { name: /zpět na hlavní stránku/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("displays the status code", () => {
    render(<Error locale="cs" status={404} />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
