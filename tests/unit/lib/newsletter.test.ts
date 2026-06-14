import { afterEach, describe, expect, it, vi } from "vitest";

import { buildEcomailTags, splitFullName, subscribeToEcomail, validateSignup } from "@/lib/newsletter";

const valid = {
  name: "Jan Novák",
  email: "jan@example.com",
  locale: "cs",
  trainingSlug: "kubernetes-pro-zacatecniky",
  consent: true,
};

describe("validateSignup", () => {
  it("accepts a valid payload", () => {
    const result = validateSignup(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        name: "Jan Novák",
        email: "jan@example.com",
        locale: "cs",
        trainingSlug: "kubernetes-pro-zacatecniky",
      });
    }
  });

  it("trims whitespace from name and email", () => {
    const result = validateSignup({ ...valid, name: "  Jan Novák  ", email: " jan@example.com " });
    expect(result.ok && result.value.name).toBe("Jan Novák");
    expect(result.ok && result.value.email).toBe("jan@example.com");
  });

  it("requires name and email", () => {
    const result = validateSignup({ ...valid, name: " ", email: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fields.name).toBe("required");
      expect(result.fields.email).toBe("required");
    }
  });

  it("rejects an invalid email", () => {
    const result = validateSignup({ ...valid, email: "not-an-email" });
    expect(!result.ok && result.fields.email).toBe("invalid");
  });

  it("requires consent", () => {
    const result = validateSignup({ ...valid, consent: false });
    expect(!result.ok && result.fields.consent).toBe("required");
  });

  it("defaults locale to cs and accepts en", () => {
    const en = validateSignup({ ...valid, locale: "en" });
    expect(en.ok && en.value.locale).toBe("en");
    const unknown = validateSignup({ ...valid, locale: "xx" });
    expect(unknown.ok && unknown.value.locale).toBe("cs");
  });

  it("allows a null training slug", () => {
    const result = validateSignup({ ...valid, trainingSlug: null });
    expect(result.ok && result.value.trainingSlug).toBeNull();
  });

  it("rejects a malformed training slug", () => {
    const result = validateSignup({ ...valid, trainingSlug: "bad slug!" });
    expect(!result.ok && result.fields.trainingSlug).toBe("invalid");
  });
});

describe("splitFullName", () => {
  it("splits on the first space into name + surname", () => {
    expect(splitFullName("Jan Novák")).toEqual({ name: "Jan", surname: "Novák" });
  });

  it("keeps everything after the first space as the surname", () => {
    expect(splitFullName("Jan van der Berg")).toEqual({ name: "Jan", surname: "van der Berg" });
  });

  it("leaves the surname empty for a single word", () => {
    expect(splitFullName("Madonna")).toEqual({ name: "Madonna", surname: "" });
  });

  it("normalizes surrounding and repeated whitespace", () => {
    expect(splitFullName("  Jan   Novák  ")).toEqual({ name: "Jan", surname: "Novák" });
  });
});

describe("buildEcomailTags", () => {
  it("includes source and language, plus training when a slug is present", () => {
    expect(buildEcomailTags({ name: "Jan Novák", email: "c@d.cz", locale: "cs", trainingSlug: "react-pro" })).toEqual([
      "web-training-news",
      "lang:cs",
      "training:react-pro",
    ]);
  });

  it("omits the training tag when there is no slug", () => {
    expect(buildEcomailTags({ name: "Jan Novák", email: "c@d.cz", locale: "en", trainingSlug: null })).toEqual([
      "web-training-news",
      "lang:en",
    ]);
  });
});

describe("subscribeToEcomail", () => {
  const input = { name: "Jan Novák", email: "jan@example.com", locale: "cs" as const, trainingSlug: "react-pro" };
  const opts = { apiKey: "test-key", listId: "7" };

  function mockFetch(response: { ok: boolean; status?: number; body?: unknown }) {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: response.ok,
      status: response.status ?? (response.ok ? 200 : 502),
      json: async () => response.body ?? {},
      text: async () => "error body",
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("posts subscriber data to the list with the API key and split name", async () => {
    const fetchMock = mockFetch({ ok: true, body: { status: 6 } });

    await subscribeToEcomail(input, opts);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.ecomail.cz/lists/7/subscribe");
    expect(init.headers.key).toBe("test-key");
    expect(JSON.parse(init.body)).toMatchObject({
      subscriber_data: {
        name: "Jan",
        surname: "Novák",
        email: "jan@example.com",
        tags: ["web-training-news", "lang:cs", "training:react-pro"],
      },
      trigger_autoresponders: false,
      update_existing: true,
      skip_confirmation: false,
    });
  });

  it("maps the Ecomail subscriber status onto the response", async () => {
    mockFetch({ ok: true, body: { status: 1 } });
    expect(await subscribeToEcomail(input, opts)).toEqual({ ok: true, status: 1 });
  });

  it("defaults to status 6 for an unexpected status", async () => {
    mockFetch({ ok: true, body: { status: 99 } });
    expect(await subscribeToEcomail(input, opts)).toEqual({ ok: true, status: 6 });
  });

  it("returns ecomail_failed on a non-ok response", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch({ ok: false, status: 500 });
    expect(await subscribeToEcomail(input, opts)).toEqual({ ok: false, error: "ecomail_failed" });
  });

  it("returns ecomail_failed when fetch throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    expect(await subscribeToEcomail(input, opts)).toEqual({ ok: false, error: "ecomail_failed" });
  });
});
