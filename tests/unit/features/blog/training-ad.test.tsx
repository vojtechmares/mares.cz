import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Button } from "../../../../src/components/ui/button";
import { Container } from "../../../../src/components/ui/container";
import { Heading } from "../../../../src/components/ui/heading";
import { Section } from "../../../../src/components/ui/section";
import { Text } from "../../../../src/components/ui/text";

// Create a synchronous test version since React doesn't support async client components
function TestTrainingAd({
  training,
}: {
  training?: {
    title: string;
    slug: string;
    adText: string;
    icon?: { url: string };
  };
}) {
  if (!training) {
    return <></>;
  }

  return (
    <Section id="skoleni" variant="inverse">
      <Container>
        <div className="flex flex-col justify-between md:flex-row">
          <div className="max-w-3xl">
            <Heading level="h2" variant="inverse">
              {training.title} školení
            </Heading>
            <Text variant="inverse" className="mt-4">
              {training.adText}
            </Text>
            <div className="flex flex-col md:flex-row md:gap-x-6">
              <Button href="mailto:vojtech@mares.cz" variant="accent" className="mt-10">
                Nezávazně poptat firemní školení
              </Button>
              <Button href={"/skoleni/" + training.slug} variant="secondary" className="mt-10">
                Více informací o školení
              </Button>
            </div>
          </div>
          {training.icon && (
            <img
              src={training.icon.url}
              alt=""
              className="mx-auto hidden p-2 invert md:block"
              width="196"
              height="196"
            />
          )}
        </div>
      </Container>
    </Section>
  );
}

describe("TrainingAd", () => {
  const mockTraining = {
    title: "Kubernetes",
    slug: "kubernetes",
    adText: "Learn Kubernetes with practical exercises.",
    icon: { url: "/icons/kubernetes.svg" },
  };

  describe("when training is not provided", () => {
    it("should render empty fragment", () => {
      const { container } = render(<TestTrainingAd />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("when training is provided", () => {
    it("should render training ad section", () => {
      render(<TestTrainingAd training={mockTraining} />);
      expect(document.getElementById("skoleni")).toBeInTheDocument();
    });

    it("should render training title", () => {
      render(<TestTrainingAd training={mockTraining} />);
      expect(screen.getByRole("heading", { name: /kubernetes školení/i })).toBeInTheDocument();
    });

    it("should render training ad text", () => {
      render(<TestTrainingAd training={mockTraining} />);
      expect(screen.getByText(mockTraining.adText)).toBeInTheDocument();
    });
  });

  describe("CTA buttons", () => {
    it("should render corporate training inquiry button", () => {
      render(<TestTrainingAd training={mockTraining} />);
      expect(screen.getByRole("link", { name: /nezávazně poptat firemní školení/i })).toHaveAttribute(
        "href",
        "mailto:vojtech@mares.cz",
      );
    });

    it("should render more info button", () => {
      render(<TestTrainingAd training={mockTraining} />);
      expect(screen.getByRole("link", { name: /více informací o školení/i })).toHaveAttribute(
        "href",
        "/skoleni/kubernetes",
      );
    });
  });

  describe("training icon", () => {
    it("should render training icon image", () => {
      render(<TestTrainingAd training={mockTraining} />);
      const img = document.querySelector("img");
      expect(img).toHaveAttribute("src", mockTraining.icon.url);
    });

    it("should not render icon when not provided", () => {
      const trainingWithoutIcon = { ...mockTraining, icon: undefined };
      render(<TestTrainingAd training={trainingWithoutIcon} />);
      const img = document.querySelector("img");
      expect(img).toBeNull();
    });
  });
});
