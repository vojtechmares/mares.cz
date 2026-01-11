import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  TrainingSessionsTable,
  CompactTrainingSessionsTable,
} from "../../../../src/features/training/training-sessions-table";
import type { TrainingSession } from "../../../../src/interfaces/training";

describe("TrainingSessionsTable", () => {
  const createMockSession = (overrides = {}): TrainingSession =>
    ({
      name: "Kubernetes Workshop",
      dates: { start: "2024-03-15" },
      location: "Praha",
      price: 10000,
      signUpURL: "https://example.com/signup",
      ...overrides,
    }) as TrainingSession;

  const mockSessions: TrainingSession[] = [
    createMockSession(),
    createMockSession({
      name: "Docker Workshop",
      dates: { start: "2024-03-20", end: "2024-03-21" },
      location: "Brno",
      price: 8000,
    }),
  ];

  describe("rendering", () => {
    it("should render table element", () => {
      render(<TrainingSessionsTable sessions={mockSessions} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("should render table headers", () => {
      render(<TrainingSessionsTable sessions={mockSessions} />);
      expect(screen.getByRole("columnheader", { name: /školení/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /datum/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /místo/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /cena/i })).toBeInTheDocument();
    });

    it("should render all sessions", () => {
      render(<TrainingSessionsTable sessions={mockSessions} />);
      expect(screen.getByText("Kubernetes Workshop")).toBeInTheDocument();
      expect(screen.getByText("Docker Workshop")).toBeInTheDocument();
    });
  });

  describe("session details", () => {
    it("should display location", () => {
      render(<TrainingSessionsTable sessions={mockSessions} />);
      expect(screen.getAllByText("Praha").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Brno").length).toBeGreaterThan(0);
    });
  });

  describe("sign up button", () => {
    it("should render sign up button when URL is available", () => {
      render(<TrainingSessionsTable sessions={mockSessions} />);
      const buttons = screen.getAllByRole("link", { name: /přihlásit se/i });
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should link to sign up form", () => {
      render(<TrainingSessionsTable sessions={[createMockSession()]} />);
      const buttons = screen.getAllByRole("link", { name: /přihlásit se/i });
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("href", "https://example.com/signup");
      });
    });

    it("should show not available message when sign up URL is undefined", () => {
      const sessionWithoutSignUp = createMockSession({
        signUpURL: undefined,
      });
      render(<TrainingSessionsTable sessions={[sessionWithoutSignUp]} />);
      expect(screen.getAllByText(/přihlašování zatím není možné/i).length).toBeGreaterThan(0);
    });
  });

  describe("empty sessions", () => {
    it("should render table with no rows when sessions is empty", () => {
      render(<TrainingSessionsTable sessions={[]} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.queryAllByRole("row")).toHaveLength(1); // Only header row
    });
  });

  describe("accessibility", () => {
    it("should have screen reader text for sign up button", () => {
      render(<TrainingSessionsTable sessions={[createMockSession()]} />);
      expect(screen.getAllByText(/na školení kubernetes workshop/i).length).toBeGreaterThan(0);
    });
  });
});

describe("CompactTrainingSessionsTable", () => {
  const createMockSession = (overrides = {}): TrainingSession =>
    ({
      name: "Kubernetes Workshop",
      dates: { start: "2024-03-15" },
      location: "Praha",
      price: 10000,
      signUpURL: "https://example.com/signup",
      ...overrides,
    }) as TrainingSession;

  const mockSessions: TrainingSession[] = [createMockSession()];

  describe("rendering", () => {
    it("should render table element", () => {
      render(<CompactTrainingSessionsTable sessions={mockSessions} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("should render compact headers (no training name, no price)", () => {
      render(<CompactTrainingSessionsTable sessions={mockSessions} />);
      expect(screen.getByRole("columnheader", { name: /datum/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /místo/i })).toBeInTheDocument();
      // Should NOT have "Školení" and "Cena" headers in compact version
      expect(screen.queryByRole("columnheader", { name: /^školení$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("columnheader", { name: /^cena$/i })).not.toBeInTheDocument();
    });

    it("should render sessions", () => {
      render(<CompactTrainingSessionsTable sessions={mockSessions} />);
      expect(screen.getAllByText("Praha").length).toBeGreaterThan(0);
    });
  });

  describe("sign up button", () => {
    it("should render sign up button when URL is available", () => {
      render(<CompactTrainingSessionsTable sessions={mockSessions} />);
      const buttons = screen.getAllByRole("link", { name: /přihlásit se/i });
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should show not available message when sign up URL is undefined", () => {
      const sessionWithoutSignUp = createMockSession({
        signUpURL: undefined,
      });
      render(<CompactTrainingSessionsTable sessions={[sessionWithoutSignUp]} />);
      expect(screen.getAllByText(/přihlašování zatím není možné/i).length).toBeGreaterThan(0);
    });
  });

  describe("empty sessions", () => {
    it("should render table with no rows when sessions is empty", () => {
      render(<CompactTrainingSessionsTable sessions={[]} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });
});
