import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ServicesConsultation } from "../../../../src/features/services/services-consultation";

describe("ServicesConsultation", () => {
  it("should render section with id='konzultace'", () => {
    render(<ServicesConsultation />);
    expect(document.getElementById("konzultace")).toBeInTheDocument();
  });

  it("should render heading", () => {
    render(<ServicesConsultation />);
    expect(screen.getByRole("heading", { name: /^konzultace$/i, level: 2 })).toBeInTheDocument();
  });

  it("should render badge", () => {
    render(<ServicesConsultation />);
    expect(screen.getByText("Jednorázová spolupráce")).toBeInTheDocument();
  });

  it("should render 3 numbered steps", () => {
    render(<ServicesConsultation />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("should render step titles", () => {
    render(<ServicesConsultation />);
    expect(screen.getByText("Úvodní schůzka")).toBeInTheDocument();
    expect(screen.getByText("Analýza a audit")).toBeInTheDocument();
    expect(screen.getByText("Doporučení a akční plán")).toBeInTheDocument();
  });

  it("should render step descriptions", () => {
    render(<ServicesConsultation />);
    expect(screen.getByText(/30 minut zdarma/i)).toBeInTheDocument();
    expect(screen.getByText(/projdu vaši infrastrukturu/i)).toBeInTheDocument();
    expect(screen.getByText(/dostanete konkrétní kroky s prioritami/i)).toBeInTheDocument();
  });

  it("should render consultation area cards", () => {
    render(<ServicesConsultation />);
    expect(screen.getByRole("heading", { name: /revize infrastruktury/i, level: 4 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /výběr technologií/i, level: 4 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ci\/cd pipeline/i, level: 4 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /optimalizace nákladů/i, level: 4 })).toBeInTheDocument();
  });

  it("should render price", () => {
    render(<ServicesConsultation />);
    expect(screen.getByText("2 500 CZK / hod")).toBeInTheDocument();
    expect(screen.getByText(/rozsah do 2 člověkodnů/i)).toBeInTheDocument();
  });

  it("should render meeting booking link", () => {
    render(<ServicesConsultation />);
    const meetingLink = screen.getByRole("link", { name: /domluvme si schůzku/i });
    expect(meetingLink).toHaveAttribute("href", "https://cal.com/vojtechmares/30min");
  });
});
