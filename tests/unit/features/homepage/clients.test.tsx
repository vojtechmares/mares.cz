import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Clients } from "../../../../src/features/homepage/clients";

describe("Clients", () => {
  describe("rendering", () => {
    it("should render section with correct id", () => {
      render(<Clients />);
      expect(document.getElementById("clients")).toBeInTheDocument();
    });

    it("should render main heading", () => {
      render(<Clients />);
      expect(screen.getByRole("heading", { name: /moji klienti/i, level: 2 })).toBeInTheDocument();
    });

    it("should render description", () => {
      render(<Clients />);
      expect(screen.getByText(/společnosti, které mi důvěřují/i)).toBeInTheDocument();
    });
  });

  describe("children", () => {
    it("should render children (client logos)", () => {
      render(
        <Clients>
          <img data-testid="client-logo" alt="Client" />
          <img data-testid="client-logo-2" alt="Client 2" />
        </Clients>,
      );
      expect(screen.getByTestId("client-logo")).toBeInTheDocument();
      expect(screen.getByTestId("client-logo-2")).toBeInTheDocument();
    });

    it("should render without children", () => {
      render(<Clients />);
      expect(screen.getByRole("heading", { name: /moji klienti/i })).toBeInTheDocument();
    });
  });

  describe("layout", () => {
    it("should contain grid container for logos", () => {
      const { container } = render(
        <Clients>
          <div>Logo</div>
        </Clients>,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });
  });
});
