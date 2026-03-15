import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ServicesCooperation } from "../../../../src/features/services/services-cooperation";

describe("ServicesCooperation", () => {
  it("should render section with id='spoluprace'", () => {
    render(<ServicesCooperation locale="cs" />);
    expect(document.getElementById("spoluprace")).toBeInTheDocument();
  });

  it("should render heading", () => {
    render(<ServicesCooperation locale="cs" />);
    expect(screen.getByRole("heading", { name: /^spolupráce$/i, level: 2 })).toBeInTheDocument();
  });

  it("should render badge", () => {
    render(<ServicesCooperation locale="cs" />);
    expect(screen.getByText("Dlouhodobé partnerství")).toBeInTheDocument();
  });

  it("should render all 4 steps", () => {
    render(<ServicesCooperation locale="cs" />);
    expect(screen.getByText("Úvodní analýza")).toBeInTheDocument();
    expect(screen.getByText("Návrh řešení")).toBeInTheDocument();
    expect(screen.getByText("Implementace")).toBeInTheDocument();
    expect(screen.getByText("Podpora a SLA")).toBeInTheDocument();
  });

  it("should render 4 list items for steps", () => {
    render(<ServicesCooperation locale="cs" />);
    const stepList = screen.getByRole("navigation", { name: /kroky spolupráce/i }).querySelector("ol")!;
    const listItems = stepList.querySelectorAll(":scope > li");
    expect(listItems).toHaveLength(4);
  });

  it("should render step descriptions", () => {
    render(<ServicesCooperation locale="cs" />);
    expect(screen.getByText(/společně zmapujeme váš současný stav/i)).toBeInTheDocument();
    expect(screen.getByText(/na základě analýzy připravím konkrétní plán/i)).toBeInTheDocument();
    expect(screen.getByText(/pracuji iterativně/i)).toBeInTheDocument();
    expect(screen.getByText(/po nasazení nabízím průběžnou podporu/i)).toBeInTheDocument();
  });

  it("should render info cards", () => {
    render(<ServicesCooperation locale="cs" />);
    expect(screen.getByRole("heading", { name: /co spolupráce zahrnuje/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /pro koho je spolupráce vhodná/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /dlouhodobá podpora a sla/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /typické projekty/i, level: 3 })).toBeInTheDocument();
  });

  it("should render price card with meeting link", () => {
    render(<ServicesCooperation locale="cs" />);
    expect(screen.getByText("cena dle domluvy")).toBeInTheDocument();
    const meetingLink = screen.getByRole("link", { name: /domluvme si schůzku/i });
    expect(meetingLink).toHaveAttribute("href", "https://cal.com/vojtechmares/30min");
  });

  it("should have navigation with steps aria-label", () => {
    render(<ServicesCooperation locale="cs" />);
    expect(screen.getByRole("navigation", { name: /kroky spolupráce/i })).toBeInTheDocument();
  });
});
