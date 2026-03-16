import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import type { TrainingSession } from "../../../../src/lib/sessions";

import {
  TrainingSessionsTable,
  CompactTrainingSessionsTable,
} from "../../../../src/features/training/training-sessions-table";

describe("TrainingSessionsTable", () => {
  const createMockSession = (overrides = {}): TrainingSession => ({
    trainingID: 1,
    name: "Kubernetes Workshop",
    dates: { start: "2024-03-15" },
    location: "Praha",
    pricing: [
      { currency: "CZK", amount: 10000 },
      { currency: "EUR", amount: 390 },
    ],
    signUpURL: "https://example.com/signup",
    ...overrides,
  });

  const mockSessions: TrainingSession[] = [
    createMockSession(),
    createMockSession({
      trainingID: 2,
      name: "Docker Workshop",
      dates: { start: "2024-03-20", end: "2024-03-21" },
      location: "Brno",
      pricing: [
        { currency: "CZK", amount: 8000 },
        { currency: "EUR", amount: 310 },
      ],
    }),
  ];

  describe("rendering", () => {
    it("should render session articles", () => {
      render(<TrainingSessionsTable locale="cs" sessions={mockSessions} />);
      expect(screen.getAllByRole("article")).toHaveLength(2);
    });

    it("should render all sessions", () => {
      render(<TrainingSessionsTable locale="cs" sessions={mockSessions} />);
      expect(screen.getAllByText("Kubernetes Workshop").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Docker Workshop").length).toBeGreaterThan(0);
    });
  });

  describe("session details", () => {
    it("should display location", () => {
      render(<TrainingSessionsTable locale="cs" sessions={mockSessions} />);
      expect(screen.getAllByText("Praha").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Brno").length).toBeGreaterThan(0);
    });
  });

  describe("sign up button", () => {
    it("should render sign up button when URL is available", () => {
      render(<TrainingSessionsTable locale="cs" sessions={mockSessions} />);
      const buttons = screen.getAllByRole("link", { name: /přihlásit se/i });
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should link to sign up form", () => {
      render(<TrainingSessionsTable locale="cs" sessions={[createMockSession()]} />);
      const buttons = screen.getAllByRole("link", { name: /přihlásit se/i });
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("href", "https://example.com/signup");
      });
    });

    it("should show not available message when sign up URL is undefined", () => {
      const sessionWithoutSignUp = createMockSession({
        signUpURL: undefined,
      });
      render(<TrainingSessionsTable locale="cs" sessions={[sessionWithoutSignUp]} />);
      expect(screen.getAllByText(/přihlašování zatím není možné/i).length).toBeGreaterThan(0);
    });
  });

  describe("empty sessions", () => {
    it("should render no articles when sessions is empty", () => {
      const { container } = render(<TrainingSessionsTable locale="cs" sessions={[]} />);
      expect(container.querySelectorAll("article")).toHaveLength(0);
    });
  });

  describe("accessibility", () => {
    it("should have screen reader text for sign up button", () => {
      render(<TrainingSessionsTable locale="cs" sessions={[createMockSession()]} />);
      expect(screen.getAllByText(/na školení kubernetes workshop/i).length).toBeGreaterThan(0);
    });
  });

  describe("training description", () => {
    it("should render description when trainingDescription is provided", () => {
      const session = createMockSession({ trainingDescription: "Hands-on Docker workshop" });
      render(<TrainingSessionsTable locale="cs" sessions={[session]} />);
      expect(screen.getAllByText("Hands-on Docker workshop").length).toBeGreaterThan(0);
    });

    it("should not render description when trainingDescription is not provided", () => {
      render(<TrainingSessionsTable locale="cs" sessions={[createMockSession()]} />);
      expect(screen.queryByText("Hands-on Docker workshop")).not.toBeInTheDocument();
    });
  });

  describe("training name links", () => {
    it("should render training name as link when trainingSlug is provided", () => {
      const sessionWithSlug = createMockSession({ trainingSlug: "kubernetes" });
      render(<TrainingSessionsTable locale="cs" sessions={[sessionWithSlug]} />);
      const links = screen.getAllByRole("link", { name: "Kubernetes Workshop" });
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toHaveAttribute("href", "/skoleni/kubernetes");
      });
    });

    it("should render training name as plain text when trainingSlug is not provided", () => {
      const sessionWithoutSlug = createMockSession({ trainingSlug: undefined });
      render(<TrainingSessionsTable locale="cs" sessions={[sessionWithoutSlug]} />);
      expect(screen.getAllByText("Kubernetes Workshop").length).toBeGreaterThan(0);
      expect(screen.queryByRole("link", { name: "Kubernetes Workshop" })).not.toBeInTheDocument();
    });
  });
});

describe("CompactTrainingSessionsTable", () => {
  const createMockSession = (overrides = {}): TrainingSession => ({
    trainingID: 1,
    name: "Kubernetes Workshop",
    dates: { start: "2024-03-15" },
    location: "Praha",
    pricing: [
      { currency: "CZK", amount: 10000 },
      { currency: "EUR", amount: 390 },
    ],
    signUpURL: "https://example.com/signup",
    ...overrides,
  });

  const mockSessions: TrainingSession[] = [createMockSession()];

  describe("rendering", () => {
    it("should render session articles", () => {
      render(<CompactTrainingSessionsTable locale="cs" sessions={mockSessions} />);
      expect(screen.getAllByRole("article")).toHaveLength(1);
    });

    it("should render sessions", () => {
      render(<CompactTrainingSessionsTable locale="cs" sessions={mockSessions} />);
      expect(screen.getAllByText("Praha").length).toBeGreaterThan(0);
    });
  });

  describe("sign up button", () => {
    it("should render sign up button when URL is available", () => {
      render(<CompactTrainingSessionsTable locale="cs" sessions={mockSessions} />);
      const buttons = screen.getAllByRole("link", { name: /přihlásit se/i });
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should show not available message when sign up URL is undefined", () => {
      const sessionWithoutSignUp = createMockSession({
        signUpURL: undefined,
      });
      render(<CompactTrainingSessionsTable locale="cs" sessions={[sessionWithoutSignUp]} />);
      expect(screen.getAllByText(/přihlašování zatím není možné/i).length).toBeGreaterThan(0);
    });
  });

  describe("empty sessions", () => {
    it("should render no articles when sessions is empty", () => {
      const { container } = render(<CompactTrainingSessionsTable locale="cs" sessions={[]} />);
      expect(container.querySelectorAll("article")).toHaveLength(0);
    });
  });
});
