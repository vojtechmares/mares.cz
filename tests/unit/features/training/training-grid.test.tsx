import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCollection } from "astro:content";

import { TrainingGrid } from "../../../../src/features/training/training-grid";

const createMockTraining = (overrides: Record<string, unknown> = {}) => ({
  id: "kubernetes",
  collection: "training" as const,
  data: {
    title: "Kubernetes",
    description: "Learn Kubernetes from scratch in this hands-on workshop",
    length: 2,
    price: { open: [{ amount: 15000, currency: "CZK" }] },
    featured: false,
    draft: false,
    icon: { src: "/images/k8s.svg" },
    ...((overrides.data as Record<string, unknown>) ?? {}),
  },
  ...Object.fromEntries(Object.entries(overrides).filter(([k]) => k !== "data")),
});

describe("TrainingGrid", () => {
  beforeEach(() => {
    vi.mocked(getCollection).mockReset();
  });

  it("renders training cards with title and price", async () => {
    vi.mocked(getCollection).mockResolvedValue([createMockTraining()] as any);
    render(await TrainingGrid({ locale: "cs" }));
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
    expect(screen.getByText(/15\s?000/)).toBeInTheDocument();
  });

  it("renders duration text", async () => {
    vi.mocked(getCollection).mockResolvedValue([createMockTraining()] as any);
    render(await TrainingGrid({ locale: "cs" }));
    expect(screen.getByText("2 dny")).toBeInTheDocument();
  });

  it("renders '1 den' for single-day training", async () => {
    vi.mocked(getCollection).mockResolvedValue([createMockTraining({ data: { length: 1 } })] as any);
    render(await TrainingGrid({ locale: "cs" }));
    expect(screen.getByText("1 den")).toBeInTheDocument();
  });

  it("truncates long descriptions", async () => {
    const longDesc = "B".repeat(300);
    vi.mocked(getCollection).mockResolvedValue([createMockTraining({ data: { description: longDesc } })] as any);
    render(await TrainingGrid({ locale: "cs" }));
    expect(screen.getByText("B".repeat(240) + "…")).toBeInTheDocument();
  });

  it("sorts featured trainings first", async () => {
    const trainings = [
      createMockTraining({ id: "docker", data: { title: "Docker", featured: false } }),
      createMockTraining({ id: "k8s", data: { title: "Kubernetes", featured: true } }),
    ];
    vi.mocked(getCollection).mockResolvedValue(trainings as any);
    render(await TrainingGrid({ locale: "cs" }));
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings[0]).toHaveTextContent("Kubernetes");
    expect(headings[1]).toHaveTextContent("Docker");
  });

  it("filters out drafts via getCollection callback", async () => {
    vi.mocked(getCollection).mockImplementation(((_collection: string, filter: any) => {
      const all = [
        createMockTraining({ id: "draft", data: { title: "Draft", draft: true } }),
        createMockTraining({ id: "published", data: { title: "Published", draft: false } }),
      ];
      return Promise.resolve(all.filter((t) => filter(t)));
    }) as any);
    render(await TrainingGrid({ locale: "cs" }));
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.queryByText("Draft")).not.toBeInTheDocument();
  });

  it("links to training detail page", async () => {
    vi.mocked(getCollection).mockResolvedValue([createMockTraining({ id: "kubernetes" })] as any);
    render(await TrainingGrid({ locale: "cs" }));
    const link = screen.getByRole("link", { name: "O školení" });
    expect(link).toHaveAttribute("href", "/skoleni/kubernetes");
  });
});
