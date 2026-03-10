import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ServicesTraining } from "../../../../src/features/services/services-training";

const mockTrainings = [
  { id: "kubernetes", title: "Kubernetes", description: "Naučte se Kubernetes" },
  { id: "docker", title: "Docker", description: "Kontejnerizace s Dockerem" },
  { id: "terraform", title: "Terraform", description: "Infrastruktura jako kód" },
];

describe("ServicesTraining", () => {
  it("should render section with id='skoleni'", () => {
    render(<ServicesTraining trainings={mockTrainings} />);
    expect(document.getElementById("skoleni")).toBeInTheDocument();
  });

  it("should render heading", () => {
    render(<ServicesTraining trainings={mockTrainings} />);
    expect(screen.getByRole("heading", { name: /^školení$/i, level: 2 })).toBeInTheDocument();
  });

  it("should render badge", () => {
    render(<ServicesTraining trainings={mockTrainings} />);
    expect(screen.getByText("Workshopy a školení")).toBeInTheDocument();
  });

  it("should render training cards with links", () => {
    render(<ServicesTraining trainings={mockTrainings} />);
    for (const training of mockTrainings) {
      expect(screen.getByRole("heading", { name: training.title, level: 3 })).toBeInTheDocument();
      expect(screen.getByText(training.description)).toBeInTheDocument();
    }
    const links = screen.getAllByRole("link", { name: /kubernetes|docker|terraform/i });
    expect(links[0]).toHaveAttribute("href", "/skoleni/kubernetes");
    expect(links[1]).toHaveAttribute("href", "/skoleni/docker");
    expect(links[2]).toHaveAttribute("href", "/skoleni/terraform");
  });

  it("should render public training info", () => {
    render(<ServicesTraining trainings={mockTrainings} />);
    expect(screen.getByRole("heading", { name: /veřejné termíny/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /zobrazit termíny/i })).toHaveAttribute("href", "/skoleni/verejne-terminy");
  });

  it("should render corporate training info", () => {
    render(<ServicesTraining trainings={mockTrainings} />);
    expect(screen.getByRole("heading", { name: /firemní školení/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText(/školení připravím na míru vašemu týmu/i)).toBeInTheDocument();
  });

  it("should render price card", () => {
    render(<ServicesTraining trainings={mockTrainings} />);
    expect(screen.getByText("od 5 400 CZK")).toBeInTheDocument();
    expect(screen.getByText(/cena za osobu na veřejném termínu/i)).toBeInTheDocument();
  });

  it("should render training list link", () => {
    render(<ServicesTraining trainings={mockTrainings} />);
    expect(screen.getByRole("link", { name: /seznam školení/i })).toHaveAttribute("href", "#skoleni");
  });

  it("should render empty grid when no trainings", () => {
    render(<ServicesTraining trainings={[]} />);
    expect(screen.getByRole("heading", { name: /^školení$/i, level: 2 })).toBeInTheDocument();
  });
});
