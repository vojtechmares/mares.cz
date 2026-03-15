import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { TrainingHero } from "../../../../src/features/training/training-hero";

describe("TrainingHero", () => {
  const defaultProps = {
    title: "Kubernetes",
    description: "Naučte se Kubernetes od základů",
    length: 2,
    price: 15000,
  };

  it("renders title and description", () => {
    render(<TrainingHero locale="cs" {...defaultProps} />);
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
    expect(screen.getByText("Naučte se Kubernetes od základů")).toBeInTheDocument();
  });

  it("formats price with Czech locale", () => {
    render(<TrainingHero locale="cs" {...defaultProps} />);
    expect(screen.getByText(/15.*000.*Kč/)).toBeInTheDocument();
  });

  it("renders '1 den' for single-day training", () => {
    render(<TrainingHero locale="cs" {...defaultProps} length={1} />);
    expect(screen.getByText("1 den")).toBeInTheDocument();
  });

  it("renders '2 dny' for multi-day training", () => {
    render(<TrainingHero locale="cs" {...defaultProps} length={2} />);
    expect(screen.getByText("2 dny")).toBeInTheDocument();
  });

  it("renders logo with alt text", () => {
    render(<TrainingHero locale="cs" {...defaultProps} logo={{ src: "/images/k8s.png" }} />);
    const img = screen.getByAltText("Kubernetes logo");
    expect(img).toHaveAttribute("src", "/images/k8s.png");
  });

  it("applies invert class for SVG logos", () => {
    render(<TrainingHero locale="cs" {...defaultProps} logo={{ src: "/images/k8s.svg" }} />);
    const img = screen.getByAltText("Kubernetes logo");
    expect(img).toHaveClass("invert");
  });

  it("does not apply invert class for non-SVG logos", () => {
    render(<TrainingHero locale="cs" {...defaultProps} logo={{ src: "/images/k8s.png" }} />);
    const img = screen.getByAltText("Kubernetes logo");
    expect(img).not.toHaveClass("invert");
  });

  it("does not render img when logo is not provided", () => {
    render(<TrainingHero locale="cs" {...defaultProps} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
