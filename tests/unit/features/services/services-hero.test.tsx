import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ServicesHero } from "../../../../src/features/services/services-hero";

describe("ServicesHero", () => {
  it("should render heading", () => {
    render(<ServicesHero trainingCount={8} />);
    expect(screen.getByRole("heading", { name: /devops služby na míru/i, level: 1 })).toBeInTheDocument();
  });

  it("should render description text", () => {
    render(<ServicesHero trainingCount={8} />);
    expect(screen.getByText(/pomáhám firmám budovat a spravovat moderní infrastrukturu/i)).toBeInTheDocument();
  });

  it("should render 3 navigation buttons with correct hrefs", () => {
    render(<ServicesHero trainingCount={8} />);
    const spoluprace = screen.getByRole("link", { name: /spolupráce/i });
    const skoleni = screen.getByRole("link", { name: /školení/i });
    const konzultace = screen.getByRole("link", { name: /konzultace/i });

    expect(spoluprace).toHaveAttribute("href", "#spoluprace");
    expect(skoleni).toHaveAttribute("href", "#skoleni");
    expect(konzultace).toHaveAttribute("href", "#konzultace");
  });

  it("should render years stat", () => {
    render(<ServicesHero trainingCount={8} />);
    const currentYears = new Date().getFullYear() - 2020;
    expect(screen.getByText(`${currentYears}+ let`)).toBeInTheDocument();
  });

  it("should render projects stat", () => {
    render(<ServicesHero trainingCount={8} />);
    expect(screen.getByText("20+ projektů")).toBeInTheDocument();
  });

  it("should render trainingCount prop in stats", () => {
    render(<ServicesHero trainingCount={12} />);
    expect(screen.getByText("12 školení")).toBeInTheDocument();
  });

  it("should render stat descriptions", () => {
    render(<ServicesHero trainingCount={8} />);
    expect(screen.getByText(/praxe v devops a cloudové infrastruktuře/i)).toBeInTheDocument();
    expect(screen.getByText(/úspěšně dokončených napříč obory/i)).toBeInTheDocument();
    expect(screen.getByText(/pravidelně vypisovaných témat/i)).toBeInTheDocument();
  });
});
