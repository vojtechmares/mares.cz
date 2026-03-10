import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { TalksHero } from "../../../../src/features/talks/talks-hero";

describe("TalksHero", () => {
  const defaultProps = {
    talkCount: 42,
    eventCount: 15,
    yearsOfSpeaking: 8,
  };

  it("renders talk count", () => {
    render(<TalksHero {...defaultProps} />);
    expect(screen.getByText("42 přednášek")).toBeInTheDocument();
  });

  it("renders event count", () => {
    render(<TalksHero {...defaultProps} />);
    expect(screen.getByText("15 konferencí")).toBeInTheDocument();
  });

  it("renders years of speaking", () => {
    render(<TalksHero {...defaultProps} />);
    expect(screen.getByText("8+ roky")).toBeInTheDocument();
  });

  it("renders Czech labels", () => {
    render(<TalksHero {...defaultProps} />);
    expect(screen.getByText("na odborných konferencích")).toBeInTheDocument();
    expect(screen.getByText("v ČR i zahraničí")).toBeInTheDocument();
    expect(screen.getByText("zkušeností s přednášením")).toBeInTheDocument();
  });

  it("has ariaLabel 'Přednášky'", () => {
    render(<TalksHero {...defaultProps} />);
    expect(screen.getByRole("region", { name: "Přednášky" })).toBeInTheDocument();
  });
});
