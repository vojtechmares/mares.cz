import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getEntry } from "astro:content";

import { TrainingAd } from "../../../../src/features/blog/training-ad";

describe("TrainingAd", () => {
  beforeEach(() => {
    vi.mocked(getEntry).mockReset();
  });

  it("renders empty when trainingSlug is not provided", async () => {
    const { container } = render(await TrainingAd({ locale: "cs", trainingSlug: undefined }));
    expect(container.innerHTML).toBe("");
  });

  it("renders training ad when slug resolves to a training", async () => {
    vi.mocked(getEntry).mockResolvedValue({
      id: "kubernetes",
      data: {
        title: "Kubernetes",
        ad: "Learn Kubernetes with practical exercises.",
        icon: { src: "/icons/kubernetes.svg" },
      },
    } as any);

    render(await TrainingAd({ locale: "cs", trainingSlug: "kubernetes" }));
    expect(screen.getByRole("heading", { name: /kubernetes školení/i })).toBeInTheDocument();
    expect(screen.getByText("Learn Kubernetes with practical exercises.")).toBeInTheDocument();
  });

  it("renders CTA buttons with correct links", async () => {
    vi.mocked(getEntry).mockResolvedValue({
      id: "kubernetes",
      data: {
        title: "Kubernetes",
        ad: "Ad text",
        icon: { src: "/icons/k8s.svg" },
      },
    } as any);

    render(await TrainingAd({ locale: "cs", trainingSlug: "kubernetes" }));
    expect(screen.getByRole("link", { name: /nezávazně poptat firemní školení/i })).toHaveAttribute(
      "href",
      "mailto:vojtech@mares.cz",
    );
    expect(screen.getByRole("link", { name: /více informací o školení/i })).toHaveAttribute(
      "href",
      "/skoleni/kubernetes",
    );
  });

  it("renders training icon", async () => {
    vi.mocked(getEntry).mockResolvedValue({
      id: "kubernetes",
      data: {
        title: "Kubernetes",
        ad: "Ad text",
        icon: { src: "/icons/kubernetes.svg" },
      },
    } as any);

    render(await TrainingAd({ locale: "cs", trainingSlug: "kubernetes" }));
    const img = document.querySelector("img");
    expect(img).toHaveAttribute("src", "/icons/kubernetes.svg");
  });

  it("renders empty when getEntry returns undefined", async () => {
    vi.mocked(getEntry).mockResolvedValue(undefined as any);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { container } = render(await TrainingAd({ locale: "cs", trainingSlug: "nonexistent" }));
    expect(container.innerHTML).toBe("");

    consoleSpy.mockRestore();
  });

  it("renders empty on error and logs to console", async () => {
    vi.mocked(getEntry).mockRejectedValue(new Error("Network error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { container } = render(await TrainingAd({ locale: "cs", trainingSlug: "failing" }));
    expect(container.innerHTML).toBe("");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
