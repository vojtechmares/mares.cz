import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookieConsentBar } from "../../src/components/layout/cookie-consent-bar";
import { actions } from "astro:actions";

describe("CookieConsentBar", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Reset the gtag mock
    global.gtag = vi.fn();
  });

  it("should render the cookie consent bar", () => {
    render(<CookieConsentBar />);

    expect(
      screen.getByText(/Tento web používá soubory cookies/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Přijmout vše/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Odmítnout vše/i }),
    ).toBeInTheDocument();
  });

  it("should render link to cookie policy", () => {
    render(<CookieConsentBar />);

    const link = screen.getByRole("link", {
      name: /zásadách používání cookies/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/zasady-pouzivani-cookies");
  });

  it("should call setCookieConsent action with 'accept' when Accept button is clicked", async () => {
    const user = userEvent.setup();
    const mockAction = vi.mocked(actions.setCookieConsent);
    mockAction.mockResolvedValue({ data: { success: true }, error: undefined });

    render(<CookieConsentBar />);

    const acceptButton = screen.getByRole("button", { name: /Přijmout vše/i });
    await user.click(acceptButton);

    expect(mockAction).toHaveBeenCalledWith({ consent: "accept" });
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("should call setCookieConsent action with 'deny' when Deny button is clicked", async () => {
    const user = userEvent.setup();
    const mockAction = vi.mocked(actions.setCookieConsent);
    mockAction.mockResolvedValue({ data: { success: true }, error: undefined });

    render(<CookieConsentBar />);

    const denyButton = screen.getByRole("button", { name: /Odmítnout vše/i });
    await user.click(denyButton);

    expect(mockAction).toHaveBeenCalledWith({ consent: "deny" });
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("should hide the consent bar after accepting cookies", async () => {
    const user = userEvent.setup();
    const mockAction = vi.mocked(actions.setCookieConsent);
    mockAction.mockResolvedValue({ data: { success: true }, error: undefined });

    render(<CookieConsentBar />);

    const acceptButton = screen.getByRole("button", { name: /Přijmout vše/i });
    await user.click(acceptButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/Tento web používá soubory cookies/i),
      ).not.toBeInTheDocument();
    });
  });

  it("should hide the consent bar after denying cookies", async () => {
    const user = userEvent.setup();
    const mockAction = vi.mocked(actions.setCookieConsent);
    mockAction.mockResolvedValue({ data: { success: true }, error: undefined });

    render(<CookieConsentBar />);

    const denyButton = screen.getByRole("button", { name: /Odmítnout vše/i });
    await user.click(denyButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/Tento web používá soubory cookies/i),
      ).not.toBeInTheDocument();
    });
  });

  it("should call gtag to grant all consent types when accepting cookies", async () => {
    const user = userEvent.setup();
    const mockAction = vi.mocked(actions.setCookieConsent);
    mockAction.mockResolvedValue({ data: { success: true }, error: undefined });

    render(<CookieConsentBar />);

    const acceptButton = screen.getByRole("button", { name: /Přijmout vše/i });
    await user.click(acceptButton);

    await waitFor(() => {
      expect(global.gtag).toHaveBeenCalledWith("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    });
  });

  it("should not call gtag when denying cookies", async () => {
    const user = userEvent.setup();
    const mockAction = vi.mocked(actions.setCookieConsent);
    mockAction.mockResolvedValue({ data: { success: true }, error: undefined });

    render(<CookieConsentBar />);

    const denyButton = screen.getByRole("button", { name: /Odmítnout vše/i });
    await user.click(denyButton);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });

    expect(global.gtag).not.toHaveBeenCalled();
  });

  it("should log error if setCookieConsent action fails", async () => {
    const user = userEvent.setup();
    const mockAction = vi.mocked(actions.setCookieConsent);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockAction.mockResolvedValue({
      data: undefined,
      error: { code: "BAD_REQUEST", message: "Invalid input" },
    });

    render(<CookieConsentBar />);

    const acceptButton = screen.getByRole("button", { name: /Přijmout vše/i });
    await user.click(acceptButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to save cookie consent:",
        expect.any(Object),
      );
    });

    // Should not hide the bar on error
    expect(
      screen.getByText(/Tento web používá soubory cookies/i),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("should log error if setCookieConsent action throws", async () => {
    const user = userEvent.setup();
    const mockAction = vi.mocked(actions.setCookieConsent);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockAction.mockRejectedValue(new Error("Network error"));

    render(<CookieConsentBar />);

    const acceptButton = screen.getByRole("button", { name: /Přijmout vše/i });
    await user.click(acceptButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to save cookie consent:",
        expect.any(Error),
      );
    });

    // Should not hide the bar on error
    expect(
      screen.getByText(/Tento web používá soubory cookies/i),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
