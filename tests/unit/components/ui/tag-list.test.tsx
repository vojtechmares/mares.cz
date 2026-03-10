import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { TagList } from "../../../../src/components/ui/tag-list";

describe("TagList", () => {
  it("returns null for empty tags array", () => {
    const { container } = render(<TagList tags={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders tags with # prefix and links to /blog/tag/{tag}", () => {
    render(<TagList tags={["docker", "kubernetes"]} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent("#docker");
    expect(links[0]).toHaveAttribute("href", "/blog/tag/docker");
    expect(links[1]).toHaveTextContent("#kubernetes");
    expect(links[1]).toHaveAttribute("href", "/blog/tag/kubernetes");
  });

  it("applies font-bold to active tag", () => {
    render(<TagList tags={["docker", "kubernetes"]} activeTag="docker" />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveClass("font-bold");
    expect(links[1]).not.toHaveClass("font-bold");
  });

  it("applies inverse variant styles", () => {
    render(<TagList tags={["docker"]} variant="inverse" />);
    const link = screen.getByRole("link");
    expect(link).toHaveClass("text-zinc-100");
  });

  it("applies default variant styles", () => {
    render(<TagList tags={["docker"]} />);
    const link = screen.getByRole("link");
    expect(link).toHaveClass("text-zinc-900");
  });
});
