import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ReferencesContainer, ReferenceCard } from "../../../../src/features/homepage/references";

describe("ReferencesContainer", () => {
  describe("rendering", () => {
    it("should render section with correct id", () => {
      render(<ReferencesContainer locale="cs" />);
      expect(document.getElementById("references")).toBeInTheDocument();
    });

    it("should render main heading", () => {
      render(<ReferencesContainer locale="cs" />);
      expect(screen.getByRole("heading", { name: /reference/i, level: 2 })).toBeInTheDocument();
    });

    it("should render description", () => {
      render(<ReferencesContainer locale="cs" />);
      expect(screen.getByText(/co o mně říkají moji klienti/i)).toBeInTheDocument();
    });
  });

  describe("children", () => {
    it("should render children (reference cards)", () => {
      render(
        <ReferencesContainer locale="cs">
          <div data-testid="reference-card">Card content</div>
        </ReferencesContainer>,
      );
      expect(screen.getByTestId("reference-card")).toBeInTheDocument();
    });

    it("should render without children", () => {
      render(<ReferencesContainer locale="cs" />);
      expect(screen.getByRole("heading", { name: /reference/i })).toBeInTheDocument();
    });
  });
});

describe("ReferenceCard", () => {
  const defaultProps = {
    authorName: "John Doe",
    authorRole: "CTO at Company",
    content: <p>This is a great testimonial about the service.</p>,
  };

  describe("rendering", () => {
    it("should render content", () => {
      render(<ReferenceCard {...defaultProps} />);
      expect(screen.getByText(/This is a great testimonial/)).toBeInTheDocument();
    });

    it("should render author name", () => {
      render(<ReferenceCard {...defaultProps} />);
      expect(screen.getByText(defaultProps.authorName)).toBeInTheDocument();
    });

    it("should render author role", () => {
      render(<ReferenceCard {...defaultProps} />);
      expect(screen.getByText(defaultProps.authorRole)).toBeInTheDocument();
    });

    it("should render as figure element", () => {
      render(<ReferenceCard {...defaultProps} />);
      expect(document.querySelector("figure")).toBeInTheDocument();
    });

    it("should render content container with prose class", () => {
      render(<ReferenceCard {...defaultProps} />);
      expect(document.querySelector(".prose")).toBeInTheDocument();
    });

    it("should render figcaption element", () => {
      render(<ReferenceCard {...defaultProps} />);
      expect(document.querySelector("figcaption")).toBeInTheDocument();
    });
  });

  describe("content prop", () => {
    it("should render ReactNode content correctly", () => {
      render(
        <ReferenceCard
          authorName="Jane Doe"
          authorRole="Developer"
          content={
            <p>
              Great work with <strong>amazing</strong> results!
            </p>
          }
        />,
      );
      expect(screen.getByText(/amazing/)).toBeInTheDocument();
    });
  });

  describe("image prop", () => {
    it("should render image in the correct slot", () => {
      render(<ReferenceCard {...defaultProps} image={<img data-testid="author-image" alt="Author" />} />);
      expect(screen.getByTestId("author-image")).toBeInTheDocument();
    });

    it("should render without image", () => {
      render(<ReferenceCard {...defaultProps} />);
      expect(screen.getByText(defaultProps.authorName)).toBeInTheDocument();
    });
  });
});
