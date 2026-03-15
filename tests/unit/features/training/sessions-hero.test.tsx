import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { SessionsHero } from "../../../../src/features/training/sessions-hero";

describe("SessionsHero", () => {
  it("renders empty state when sessionCount is 0", () => {
    render(<SessionsHero locale="cs" sessionCount={0} topicCount={0} nextSessionDate={null} />);
    expect(screen.getByText(/nejsou vypsány žádné veřejné termíny/)).toBeInTheDocument();
    const button = screen.getByRole("link", { name: "Všechna školení" });
    expect(button).toHaveAttribute("href", "#skoleni");
  });

  it("renders stats when sessionCount > 0", () => {
    render(<SessionsHero locale="cs" sessionCount={5} topicCount={3} nextSessionDate="2025-04-15" />);
    expect(screen.getByText("5 termínů")).toBeInTheDocument();
    expect(screen.getByText("3 témat")).toBeInTheDocument();
  });

  it("renders formatted next session date", () => {
    render(<SessionsHero locale="cs" sessionCount={5} topicCount={3} nextSessionDate="2025-04-15" />);
    const formatted = new Date("2025-04-15").toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "long",
    });
    expect(screen.getByText(formatted)).toBeInTheDocument();
  });

  it("omits date box when nextSessionDate is null", () => {
    render(<SessionsHero locale="cs" sessionCount={5} topicCount={3} nextSessionDate={null} />);
    expect(screen.queryByText("nejbližší volný termín")).not.toBeInTheDocument();
  });

  it("has correct ariaLabel", () => {
    render(<SessionsHero locale="cs" sessionCount={0} topicCount={0} nextSessionDate={null} />);
    expect(screen.getByRole("region", { name: "Veřejné termíny školení" })).toBeInTheDocument();
  });
});
