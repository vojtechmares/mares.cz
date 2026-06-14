import { actions } from "astro:actions";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TrainingNewsletterSignUp } from "@/features/training/training-newsletter-signup";
import { t } from "@/i18n";

// The component calls `actions.newsletter.signup`; `astro:actions` is aliased to a
// vi.fn() stub (see vitest.config.ts + tests/mocks/astro-actions.ts). Cast to a loose
// Mock so we can resolve any { data, error } shape without fighting the action types.
const signup = actions.newsletter.signup as unknown as ReturnType<typeof vi.fn>;

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(t("en", "newsletter.name_label")), "Jan Novak");
  await user.type(screen.getByLabelText(t("en", "newsletter.email_label")), "jan@example.com");
  await user.click(screen.getByRole("checkbox"));
}

function submitButton() {
  return screen.getByRole("button", { name: t("en", "newsletter.submit") });
}

function lastSignupInput() {
  return signup.mock.calls[0][0];
}

describe("TrainingNewsletterSignUp", () => {
  beforeEach(() => {
    signup.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows validation errors and does not call the action when empty", async () => {
    const user = userEvent.setup();
    render(<TrainingNewsletterSignUp locale="en" />);

    await user.click(submitButton());

    expect(signup).not.toHaveBeenCalled();
    expect(screen.getAllByText(t("en", "newsletter.error_required")).length).toBeGreaterThan(0);
  });

  it("submits the full name, page locale and training slug, then shows the confirm message", async () => {
    signup.mockResolvedValue({ data: { ok: true, status: 6 }, error: undefined });
    const user = userEvent.setup();
    render(<TrainingNewsletterSignUp locale="en" trainingSlug="react-pro" />);

    await fillValidForm(user);
    await user.click(submitButton());

    await waitFor(() => expect(signup).toHaveBeenCalledTimes(1));
    expect(lastSignupInput()).toMatchObject({
      name: "Jan Novak",
      email: "jan@example.com",
      locale: "en",
      trainingSlug: "react-pro",
      consent: true,
    });
    expect(await screen.findByText(t("en", "newsletter.success_confirm"))).toBeInTheDocument();
  });

  it("sends a null training slug when not on a training page", async () => {
    signup.mockResolvedValue({ data: { ok: true, status: 6 }, error: undefined });
    const user = userEvent.setup();
    render(<TrainingNewsletterSignUp locale="en" />);

    await fillValidForm(user);
    await user.click(submitButton());

    await waitFor(() => expect(signup).toHaveBeenCalled());
    expect(lastSignupInput().trainingSlug).toBeNull();
  });

  it("shows the already-subscribed message on status 1", async () => {
    signup.mockResolvedValue({ data: { ok: true, status: 1 }, error: undefined });
    const user = userEvent.setup();
    render(<TrainingNewsletterSignUp locale="en" />);

    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByText(t("en", "newsletter.success_already"))).toBeInTheDocument();
  });

  it("shows an error message when Ecomail fails", async () => {
    signup.mockResolvedValue({ data: { ok: false, error: "ecomail_failed" }, error: undefined });
    const user = userEvent.setup();
    render(<TrainingNewsletterSignUp locale="en" />);

    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByText(t("en", "newsletter.error_message"))).toBeInTheDocument();
  });

  it("shows an error message when the action itself errors", async () => {
    signup.mockResolvedValue({ data: undefined, error: { code: "INTERNAL_SERVER_ERROR" } });
    const user = userEvent.setup();
    render(<TrainingNewsletterSignUp locale="en" />);

    await fillValidForm(user);
    await user.click(submitButton());

    expect(await screen.findByText(t("en", "newsletter.error_message"))).toBeInTheDocument();
  });
});
