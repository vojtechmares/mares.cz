import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { BackofficeClient } from "../../../../src/lib/backoffice/client";

const mockFetch = vi.fn();

describe("BackofficeClient", () => {
  const oidcConfig = {
    issuer: "https://auth.example.com",
    clientId: "test-client",
    clientSecret: "test-secret",
  };

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function setupOIDCMocks() {
    // OIDC discovery
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token_endpoint: "https://auth.example.com/oauth/token" }),
    });
    // Token request
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: "test-token-123" }),
    });
  }

  it("fetches sessions with bearer token", async () => {
    setupOIDCMocks();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [{ id: 1 }] }),
    });

    const client = new BackofficeClient("https://api.example.com", oidcConfig);
    const sessions = await client.getSessions();

    expect(sessions).toEqual([{ id: 1 }]);
    // Third call is the API request
    expect(mockFetch.mock.calls[2][1].headers.Authorization).toBe("Bearer test-token-123");
  });

  it("builds URL with query params", async () => {
    setupOIDCMocks();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    });

    const client = new BackofficeClient("https://api.example.com", oidcConfig);
    await client.getSessions({
      limit: 10,
      sort: "date",
      order: "asc",
      status: ["SCHEDULED", "CONFIRMED"],
      training_id: 5,
      cursor: "abc",
      include_deleted: true,
    });

    const url = new URL(mockFetch.mock.calls[2][0]);
    expect(url.pathname).toBe("/v1/sessions");
    expect(url.searchParams.get("limit")).toBe("10");
    expect(url.searchParams.get("sort")).toBe("date");
    expect(url.searchParams.get("order")).toBe("asc");
    expect(url.searchParams.getAll("status")).toEqual(["SCHEDULED", "CONFIRMED"]);
    expect(url.searchParams.get("training_id")).toBe("5");
    expect(url.searchParams.get("cursor")).toBe("abc");
    expect(url.searchParams.get("include_deleted")).toBe("true");
  });

  it("caches token for subsequent calls", async () => {
    setupOIDCMocks();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    });
    // Second getSessions call — no new OIDC calls
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [{ id: 2 }] }),
    });

    const client = new BackofficeClient("https://api.example.com", oidcConfig);
    await client.getSessions();
    const sessions = await client.getSessions();

    expect(sessions).toEqual([{ id: 2 }]);
    // 3 calls for first request (discovery + token + api), 1 for second (api only)
    expect(mockFetch).toHaveBeenCalledTimes(4);
  });

  it("throws on failed API request", async () => {
    setupOIDCMocks();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const client = new BackofficeClient("https://api.example.com", oidcConfig);
    await expect(client.getSessions()).rejects.toThrow("API request failed: 500 Internal Server Error");
  });

  it("throws on failed OIDC discovery", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const client = new BackofficeClient("https://api.example.com", oidcConfig);
    await expect(client.getSessions()).rejects.toThrow("OIDC discovery failed: 404");
  });

  it("throws on failed token request", async () => {
    // Discovery succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token_endpoint: "https://auth.example.com/oauth/token" }),
    });
    // Token request fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: () => Promise.resolve("Invalid credentials"),
    });

    const client = new BackofficeClient("https://api.example.com", oidcConfig);
    await expect(client.getSessions()).rejects.toThrow("Token request failed: 401 - Invalid credentials");
  });

  it("sends audience in scope when configured", async () => {
    const configWithAudience = { ...oidcConfig, audience: "my-api" };
    // Discovery
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token_endpoint: "https://auth.example.com/oauth/token" }),
    });
    // Token
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: "token" }),
    });
    // API
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    });

    const client = new BackofficeClient("https://api.example.com", configWithAudience);
    await client.getSessions();

    // Check the token request body includes audience
    const tokenCall = mockFetch.mock.calls[1];
    const body = new URLSearchParams(tokenCall[1].body);
    expect(body.get("scope")).toBe("openid my-api");
  });

  it("sends openid scope without audience when not configured", async () => {
    setupOIDCMocks();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    });

    const client = new BackofficeClient("https://api.example.com", oidcConfig);
    await client.getSessions();

    const tokenCall = mockFetch.mock.calls[1];
    const body = new URLSearchParams(tokenCall[1].body);
    expect(body.get("scope")).toBe("openid");
  });
});
