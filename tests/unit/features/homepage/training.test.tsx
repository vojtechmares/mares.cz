import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrainingList } from "../../../../src/features/homepage/training";

describe("TrainingList", () => {
  const mockTrainings = [
    {
      title: "Kubernetes",
      slug: "kubernetes",
      icon: { url: "/icons/kubernetes.svg" },
    },
    {
      title: "Docker",
      slug: "docker",
      icon: { url: "/icons/docker.svg" },
    },
    {
      title: "Terraform",
      slug: "terraform",
      icon: { url: "/icons/terraform.svg" },
    },
  ] as Array<{
    title: string;
    slug: string;
    icon: { url: string };
  }>;

  describe("rendering", () => {
    it("should render section with correct id", () => {
      render(<TrainingList trainings={mockTrainings} />);
      expect(document.getElementById("skoleni")).toBeInTheDocument();
    });

    it("should render main heading", () => {
      render(<TrainingList trainings={mockTrainings} />);
      expect(
        screen.getByRole("heading", { name: /devops školení/i, level: 2 }),
      ).toBeInTheDocument();
    });

    it("should render description", () => {
      render(<TrainingList trainings={mockTrainings} />);
      expect(
        screen.getByText(/sdílím své zkušenosti a znalosti/i),
      ).toBeInTheDocument();
    });
  });

  describe("training cards", () => {
    it("should render all trainings", () => {
      render(<TrainingList trainings={mockTrainings} />);
      mockTrainings.forEach((training) => {
        // Each training appears twice (mobile + desktop grid)
        expect(
          screen.getAllByText(training.title).length,
        ).toBeGreaterThanOrEqual(1);
      });
    });

    it("should render training links with correct href", () => {
      render(<TrainingList trainings={mockTrainings} />);
      mockTrainings.forEach((training) => {
        const links = screen.getAllByRole("link", {
          name: new RegExp(training.title, "i"),
        });
        links.forEach((link) => {
          expect(link).toHaveAttribute("href", `/skoleni/${training.slug}`);
        });
      });
    });

    it("should render training icons", () => {
      render(<TrainingList trainings={mockTrainings} />);
      mockTrainings.forEach((training) => {
        const images = screen.getAllByAltText(
          `Ikona školení ${training.title}`,
        );
        expect(images.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("responsive layouts", () => {
    it("should render mobile grid", () => {
      const { container } = render(<TrainingList trainings={mockTrainings} />);
      const mobileGrid = container.querySelector(".lg\\:hidden");
      expect(mobileGrid).toBeInTheDocument();
    });

    it("should render desktop grid", () => {
      const { container } = render(<TrainingList trainings={mockTrainings} />);
      const desktopGrid = container.querySelector(".hidden.lg\\:block");
      expect(desktopGrid).toBeInTheDocument();
    });
  });

  describe("empty trainings", () => {
    it("should render with empty trainings array", () => {
      render(<TrainingList trainings={[]} />);
      expect(
        screen.getByRole("heading", { name: /devops školení/i }),
      ).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have lazy loading on images", () => {
      render(<TrainingList trainings={mockTrainings} />);
      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("loading", "lazy");
      });
    });
  });
});
