import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Services } from "../../../../src/features/homepage/services";

describe("Services", () => {
  describe("rendering", () => {
    it("should render section with correct id", () => {
      render(<Services />);
      expect(document.getElementById("sluzby")).toBeInTheDocument();
    });

    it("should render main heading", () => {
      render(<Services />);
      expect(
        screen.getByRole("heading", { name: /služby/i, level: 2 }),
      ).toBeInTheDocument();
    });

    it("should render description", () => {
      render(<Services />);
      expect(
        screen.getByText(/co dělám a jak vám mohu pomoci/i),
      ).toBeInTheDocument();
    });
  });

  describe("service cards", () => {
    it("should render consultation service", () => {
      render(<Services />);
      expect(
        screen.getByRole("heading", { name: /konzultace/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/potřebujete poradit/i)).toBeInTheDocument();
    });

    it("should render training service (featured)", () => {
      render(<Services />);
      expect(
        screen.getByRole("heading", { name: /^školení$/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/formou workshopu/i)).toBeInTheDocument();
    });

    it("should render DevOps cooperation service", () => {
      render(<Services />);
      expect(
        screen.getByRole("heading", { name: /devops spolupráce/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/dlouhodobou spolupráci/i)).toBeInTheDocument();
    });
  });

  describe("service buttons", () => {
    it("should render consultation email link", () => {
      render(<Services />);
      const emailLinks = screen.getAllByRole("link", {
        name: /napište mi/i,
      });
      const emailLink = emailLinks.find((link) =>
        link.getAttribute("href")?.includes("mailto:"),
      );
      expect(emailLink).toHaveAttribute("href", "mailto:vojtech@mares.cz");
    });

    it("should render training list link", () => {
      render(<Services />);
      const trainingLink = screen.getByRole("link", {
        name: /seznam školení/i,
      });
      expect(trainingLink).toHaveAttribute("href", "/#skoleni");
    });
  });
});
