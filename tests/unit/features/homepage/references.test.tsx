import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ReferencesContainer,
  ReferenceCard,
} from "../../../../src/features/homepage/references";

describe("ReferencesContainer", () => {
  describe("rendering", () => {
    it("should render section with correct id", () => {
      render(<ReferencesContainer />);
      expect(document.getElementById("references")).toBeInTheDocument();
    });

    it("should render main heading", () => {
      render(<ReferencesContainer />);
      expect(
        screen.getByRole("heading", { name: /reference/i, level: 2 }),
      ).toBeInTheDocument();
    });

    it("should render description", () => {
      render(<ReferencesContainer />);
      expect(
        screen.getByText(/co o mně říkají moji klienti/i),
      ).toBeInTheDocument();
    });
  });

  describe("children", () => {
    it("should render children (reference cards)", () => {
      render(
        <ReferencesContainer>
          <div data-testid="reference-card">Card content</div>
        </ReferencesContainer>,
      );
      expect(screen.getByTestId("reference-card")).toBeInTheDocument();
    });

    it("should render without children", () => {
      render(<ReferencesContainer />);
      expect(
        screen.getByRole("heading", { name: /reference/i }),
      ).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have list role for cards container", () => {
      render(<ReferencesContainer />);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });
  });
});

describe("ReferenceCard", () => {
  const defaultProps = {
    content: "This is a great testimonial about the service.",
    authorName: "John Doe",
    authorRole: "CTO at Company",
  };

  describe("rendering", () => {
    it("should render content as blockquote", () => {
      render(<ReferenceCard {...defaultProps} />);
      expect(screen.getByText(defaultProps.content)).toBeInTheDocument();
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

    it("should render blockquote element", () => {
      render(<ReferenceCard {...defaultProps} />);
      expect(document.querySelector("blockquote")).toBeInTheDocument();
    });

    it("should render figcaption element", () => {
      render(<ReferenceCard {...defaultProps} />);
      expect(document.querySelector("figcaption")).toBeInTheDocument();
    });
  });

  describe("HTML content", () => {
    it("should render HTML content correctly", () => {
      const htmlContent = "Great work with <strong>amazing</strong> results!";
      render(<ReferenceCard {...defaultProps} content={htmlContent} />);
      expect(screen.getByText(/amazing/)).toBeInTheDocument();
    });
  });

  describe("children (image)", () => {
    it("should render children for image slot", () => {
      render(
        <ReferenceCard {...defaultProps}>
          <img data-testid="author-image" alt="Author" />
        </ReferenceCard>,
      );
      expect(screen.getByTestId("author-image")).toBeInTheDocument();
    });

    it("should render without children", () => {
      render(<ReferenceCard {...defaultProps} />);
      expect(screen.getByText(defaultProps.authorName)).toBeInTheDocument();
    });
  });
});
