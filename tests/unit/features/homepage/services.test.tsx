import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Services } from "../../../../src/features/homepage/services";

describe("Services", () => {
  describe("rendering", () => {
    it("should render section with correct id", () => {
      render(<Services locale="cs" />);
      expect(document.getElementById("sluzby")).toBeInTheDocument();
    });

    it("should render main heading", () => {
      render(<Services locale="cs" />);
      expect(screen.getByRole("heading", { name: /služby/i, level: 2 })).toBeInTheDocument();
    });

    it("should render description", () => {
      render(<Services locale="cs" />);
      expect(screen.getByText(/co dělám a jak vám mohu pomoci/i)).toBeInTheDocument();
    });
  });

  describe("service cards", () => {
    it("should render consultation service", () => {
      render(<Services locale="cs" />);
      expect(screen.getByRole("heading", { name: /konzultace/i })).toBeInTheDocument();
      expect(screen.getByText(/potřebujete poradit/i)).toBeInTheDocument();
    });

    it("should render training service (featured)", () => {
      render(<Services locale="cs" />);
      expect(screen.getByRole("heading", { name: /^školení$/i })).toBeInTheDocument();
      expect(screen.getByText(/formou workshopu/i)).toBeInTheDocument();
    });

    it("should render DevOps cooperation service", () => {
      render(<Services locale="cs" />);
      expect(screen.getByRole("heading", { name: /devops spolupráce/i })).toBeInTheDocument();
      expect(screen.getByText(/dlouhodobou spolupráci/i)).toBeInTheDocument();
    });
  });

  describe("service buttons", () => {
    it("should render consultation meeting link", () => {
      render(<Services locale="cs" />);
      const meetingLink = screen.getByRole("link", {
        name: /domluvme si schůzku/i,
      });
      expect(meetingLink).toHaveAttribute("href", "https://cal.com/vojtechmares/30min");
    });

    it("should render training list link", () => {
      render(<Services locale="cs" />);
      const trainingLink = screen.getByRole("link", {
        name: /seznam školení/i,
      });
      expect(trainingLink).toHaveAttribute("href", "/#skoleni");
    });
  });
});
