import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../../../../src/features/layout/footer";

describe("Footer", () => {
  const mockPages = [
    { title: "O mně", slug: "o-mne" },
    { title: "Reference", slug: "reference" },
  ] as Array<{ title: string; slug: string }>;

  const mockTrainings = [
    { title: "Kubernetes", slug: "kubernetes" },
    { title: "Docker", slug: "docker" },
  ] as Array<{ title: string; slug: string }>;

  const mockStaticLinks = [
    { name: "Blog", href: "/blog" },
    { name: "RSS", href: "/rss.xml" },
  ];

  const defaultProps = {
    pages: mockPages,
    trainings: mockTrainings,
    staticLinks: mockStaticLinks,
    currentYear: 2024,
  };

  describe("rendering", () => {
    it("should render footer element", () => {
      render(<Footer {...defaultProps} />);
      expect(document.querySelector("footer")).toBeInTheDocument();
    });

    it("should render brand name", () => {
      render(<Footer {...defaultProps} />);
      expect(
        screen.getByRole("heading", { name: /vojtěch mareš/i }),
      ).toBeInTheDocument();
    });
  });

  describe("contact information", () => {
    it("should render phone number", () => {
      render(<Footer {...defaultProps} />);
      expect(
        screen.getByRole("link", { name: /\+420 732 490 651/i }),
      ).toHaveAttribute("href", "tel:+420732490651");
    });

    it("should render email", () => {
      render(<Footer {...defaultProps} />);
      const emailLinks = screen.getAllByRole("link", {
        name: /vojtech@mares\.cz/i,
      });
      expect(emailLinks.length).toBeGreaterThan(0);
    });

    it("should render company ID (IČO)", () => {
      render(<Footer {...defaultProps} />);
      expect(screen.getByText("06999280")).toBeInTheDocument();
    });

    it("should render VAT ID (DIČ)", () => {
      render(<Footer {...defaultProps} />);
      expect(screen.getByText("CZ9709180063")).toBeInTheDocument();
    });
  });

  describe("trainings section", () => {
    it("should render trainings heading", () => {
      render(<Footer {...defaultProps} />);
      expect(
        screen.getByRole("heading", { name: /školení/i }),
      ).toBeInTheDocument();
    });

    it("should render all trainings", () => {
      render(<Footer {...defaultProps} />);
      mockTrainings.forEach((training) => {
        expect(
          screen.getByRole("link", { name: training.title }),
        ).toBeInTheDocument();
      });
    });

    it("should render training links with correct href", () => {
      render(<Footer {...defaultProps} />);
      mockTrainings.forEach((training) => {
        expect(
          screen.getByRole("link", { name: training.title }),
        ).toHaveAttribute("href", `/skoleni/${training.slug}`);
      });
    });
  });

  describe("links section", () => {
    it("should render links heading", () => {
      render(<Footer {...defaultProps} />);
      expect(
        screen.getByRole("heading", { name: /důležité odkazy/i }),
      ).toBeInTheDocument();
    });

    it("should render static links", () => {
      render(<Footer {...defaultProps} />);
      mockStaticLinks.forEach((link) => {
        expect(screen.getByRole("link", { name: link.name })).toHaveAttribute(
          "href",
          link.href,
        );
      });
    });

    it("should render page links", () => {
      render(<Footer {...defaultProps} />);
      mockPages.forEach((page) => {
        expect(screen.getByRole("link", { name: page.title })).toHaveAttribute(
          "href",
          `/${page.slug}`,
        );
      });
    });
  });

  describe("CTA section", () => {
    it("should render CTA heading", () => {
      render(<Footer {...defaultProps} />);
      expect(
        screen.getByRole("heading", { name: /zaujal jsem vás/i }),
      ).toBeInTheDocument();
    });

    it("should render meeting booking button", () => {
      render(<Footer {...defaultProps} />);
      expect(
        screen.getByRole("link", { name: /domluvme si schůzku/i }),
      ).toHaveAttribute("href", "https://cal.com/vojtechmares/30min");
    });
  });

  describe("social links", () => {
    it("should render Bluesky link", () => {
      render(<Footer {...defaultProps} />);
      expect(screen.getByLabelText(/bluesky/i)).toHaveAttribute(
        "href",
        "https://bsky.app/profile/mares.cz",
      );
    });

    it("should render LinkedIn link", () => {
      render(<Footer {...defaultProps} />);
      expect(screen.getByLabelText(/linkedin/i)).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/vojtech-mares/",
      );
    });

    it("should render X link", () => {
      render(<Footer {...defaultProps} />);
      expect(screen.getByLabelText(/na X/i)).toHaveAttribute(
        "href",
        "https://x.com/vojtechmares_",
      );
    });

    it("should render GitHub link", () => {
      render(<Footer {...defaultProps} />);
      expect(screen.getByLabelText(/github/i)).toHaveAttribute(
        "href",
        "https://github.com/vojtechmares",
      );
    });

    it("should open social links in new tab", () => {
      render(<Footer {...defaultProps} />);
      const socialLinks = [
        screen.getByLabelText(/bluesky/i),
        screen.getByLabelText(/linkedin/i),
        screen.getByLabelText(/na X/i),
        screen.getByLabelText(/github/i),
      ];
      socialLinks.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });
  });

  describe("copyright", () => {
    it("should render copyright text with current year", () => {
      render(<Footer {...defaultProps} />);
      expect(
        screen.getByText(/copyright.*2024.*vojtěch mareš/i),
      ).toBeInTheDocument();
    });

    it("should update copyright year dynamically", () => {
      render(<Footer {...defaultProps} currentYear={2025} />);
      expect(
        screen.getByText(/copyright.*2025.*vojtěch mareš/i),
      ).toBeInTheDocument();
    });
  });
});
