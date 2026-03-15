import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Cooperation } from "../../../../src/features/homepage/cooperation";

describe("Cooperation", () => {
  describe("rendering", () => {
    it("should render section with correct id", () => {
      render(<Cooperation locale="cs" />);
      expect(document.getElementById("z-nuly-do-cloudu")).toBeInTheDocument();
    });

    it("should render main heading", () => {
      render(<Cooperation locale="cs" />);
      expect(screen.getByRole("heading", { name: /z nuly do cloudu/i, level: 2 })).toBeInTheDocument();
    });

    it("should render description", () => {
      render(<Cooperation locale="cs" />);
      expect(screen.getByText(/jak může vypadat naše spolupráce/i)).toBeInTheDocument();
    });
  });

  describe("cooperation steps", () => {
    it("should render step 1: Analýza současného stavu", () => {
      render(<Cooperation locale="cs" />);
      expect(screen.getByText(/analýza současného stavu/i)).toBeInTheDocument();
      expect(screen.getByText(/identifikujeme slabá místa/i)).toBeInTheDocument();
    });

    it("should render step 2: Návrh řešení", () => {
      render(<Cooperation locale="cs" />);
      expect(screen.getByText(/návrh řešení/i)).toBeInTheDocument();
      expect(screen.getByText(/navrhnu efektivní řešení/i)).toBeInTheDocument();
    });

    it("should render step 3: Implementace", () => {
      render(<Cooperation locale="cs" />);
      expect(screen.getByText(/implementace/i)).toBeInTheDocument();
      expect(screen.getByText(/přesunu vaši aplikaci do kubernetes/i)).toBeInTheDocument();
    });

    it("should render step 4: Školení vašeho týmu", () => {
      render(<Cooperation locale="cs" />);
      expect(screen.getByText(/školení vašeho týmu/i)).toBeInTheDocument();
      expect(screen.getByText(/naučím vás používat moderní technologie/i)).toBeInTheDocument();
    });

    it("should render step 5: Dlouhodobá spolupráce a podpora", () => {
      render(<Cooperation locale="cs" />);
      expect(screen.getByText(/dlouhodobá spolupráce a podpora/i)).toBeInTheDocument();
      expect(screen.getByText(/průběžně rozvíjet infrastrukturu/i)).toBeInTheDocument();
    });

    it("should render all 5 steps", () => {
      render(<Cooperation locale="cs" />);
      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(5);
    });
  });

  describe("accessibility", () => {
    it("should have navigation with Progress aria-label", () => {
      render(<Cooperation locale="cs" />);
      expect(screen.getByRole("navigation", { name: /progress/i })).toBeInTheDocument();
    });

    it("should have ordered list for steps", () => {
      render(<Cooperation locale="cs" />);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });
  });
});
