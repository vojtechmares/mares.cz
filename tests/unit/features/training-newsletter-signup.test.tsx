import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TrainingNewsletterSignUp } from "@/features/training/training-newsletter-signup";
import { t } from "@/i18n";

function mockFetch(response: unknown, ok = true, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => response,
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(t("en", "newsletter.name_label")), "Jan Novak");
  await user.type(screen.getByLabelText(t("en", "newsletter.email_label")), "jan@example.com");
  await user.click(screen.getByRole("checkbox"));
}

function submitButton() {
  return screen.getByRole("button", { name: t("en", "newsletter.submit") });
}

function lastFetchBody(fetchMock: ReturnType<typeof vi.fn>) {
  return JSON.parse(fetchMock.mock.calls[0][1].body as string);
}

describe("TrainingNewsletterSignUp", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("shows validation errors and does not call the API when empty", async () => {
    const fetchMock = mockFetch({ ok: true, status: 6 });
    const user = userEvent.setup();
    render(<TrainingNewsletterSignUp locale="en" />);

    await user.click(submitButton());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getAllByText(t("en", "newsletter.error_required")).length).toBeGreaterThan(0);
  });

  it("submits the full name, page locale and training slug, then shows the confirm message", async () => {
    const fetchMock = mockFetch({ ok: true, status: 6 });
    const user = userEvent.setup();
    render(<TrainingNewsletterSignUp locale="en" trainingSlug="react-pro" />);

    await fillValidForm(user);
    await user.click(submitButton());

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(lastFetchBody(fetchMock)).toMatchObject({
      name: "Jan Novak",
      email: "jan@example.com",
      locale: "en",
      trainingSlug: "react-pro",
      consent: true,
    });
    expect(await screen.findByText(t("en", "newsletter.success_confirm"))).toBeInTheDocument();
  });

  it("sends a null training slug when not on a training page", async () => {
    const fetchMock = mockFetch({ ok: true, status: 6 });
    const user = userEvent.setup();
    render(<TrainingNewsletterSignUp locale="en" />);

    await fillValidForm(user);
    await user.click(submitButton());

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(lastFetchBody(fetchMock).trainingSlug).toBeNull();
  });

  it("shows the already-subscribed message on status 1", async () => {
    mockFetch({ ok: true, status: 1 });
    const user = userEvent.setup();
    render(<TrainingNewsletterSignUp locale="en" />);

    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByText(t("en", "newsletter.success_already"))).toBeInTheDocument();
  });

  it("shows an error message when the API fails", async () => {
    mockFetch({ ok: false, error: "ecomail_failed" }, false, 502);
    const user = userEvent.setup();
    render(<TrainingNewsletterSignUp locale="en" />);

    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByText(t("en", "newsletter.error_message"))).toBeInTheDocument();
  });
});
