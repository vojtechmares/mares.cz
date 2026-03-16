import { describe, it, expect, vi, beforeEach } from "vitest";

import type { APISession } from "../../../../src/lib/backoffice/types";

let mockGetSessions: ReturnType<typeof vi.fn>;

vi.mock("../../../../src/lib/backoffice", () => {
  return {
    BackofficeClient: class MockBackofficeClient {
      static lastInstance: any;
      config: any;
      constructor(baseUrl: string, oidcConfig: any) {
        this.config = { baseUrl, oidcConfig };
        MockBackofficeClient.lastInstance = this;
      }
      getSessions = (...args: any[]) => mockGetSessions(...args);
    },
  };
});

import { BackofficeClient } from "../../../../src/lib/backoffice";

import { sessionLoader } from "../../../../src/lib/loaders/session-loader";

const createMockAPISession = (overrides: Partial<APISession> = {}): APISession => ({
  id: 1,
  training_id: 10,
  training_name: "Kubernetes Workshop",
  session_type: "OPEN",
  length: 2,
  capacity: 12,
  date: "2024-06-15T09:00:00Z",
  location: "Praha",
  address: "Some Address",
  pricing: [
    { currency: "CZK", amount: 15000 },
    { currency: "EUR", amount: 590 },
  ],
  status: "SCHEDULED",
  signup_url: "https://example.com/signup",
  create_time: "2024-01-01T00:00:00Z",
  update_time: "2024-01-01T00:00:00Z",
  delete_time: null,
  purge_time: null,
  ...overrides,
});

describe("sessionLoader", () => {
  const config = {
    apiUrl: "https://api.example.com",
    oidcIssuer: "https://auth.example.com",
    clientId: "client-id",
    clientSecret: "client-secret",
  };

  const collectionContext = () => ({ collection: "session" }) as any;

  beforeEach(() => {
    mockGetSessions = vi.fn();
  });

  it("generates session ID from slugified name and date", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession()]);
    const loader = sessionLoader(config);
    const result = await loader.loadCollection(collectionContext());

    expect(result.entries[0].id).toBe("kubernetes-workshop-2024-06-15");
  });

  it("transforms API session to content data", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession()]);
    const loader = sessionLoader(config);
    const result = await loader.loadCollection(collectionContext());

    expect(result.entries[0]).toEqual({
      id: "kubernetes-workshop-2024-06-15",
      data: {
        trainingID: 10,
        name: "Kubernetes Workshop",
        dates: { start: "2024-06-15", end: "2024-06-16" },
        location: "Praha",
        pricing: [
          { currency: "CZK", amount: 15000 },
          { currency: "EUR", amount: 590 },
        ],
        signUpURL: "https://example.com/signup",
      },
    });
  });

  it("calculates end date for multi-day sessions", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession({ length: 3 })]);
    const loader = sessionLoader(config);
    const result = await loader.loadCollection(collectionContext());

    expect(result.entries[0].data.dates.end).toBe("2024-06-17");
  });

  it("omits end date for single-day sessions", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession({ length: 1 })]);
    const loader = sessionLoader(config);
    const result = await loader.loadCollection(collectionContext());

    expect(result.entries[0].data.dates.end).toBeUndefined();
  });

  it("omits signUpURL when null", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession({ signup_url: null })]);
    const loader = sessionLoader(config);
    const result = await loader.loadCollection(collectionContext());

    expect(result.entries[0].data.signUpURL).toBeUndefined();
  });

  it("loads multiple sessions", async () => {
    mockGetSessions.mockResolvedValue([
      createMockAPISession({ id: 1, training_name: "K8s" }),
      createMockAPISession({ id: 2, training_name: "Docker" }),
    ]);
    const loader = sessionLoader(config);
    const result = await loader.loadCollection(collectionContext());

    expect(result.entries).toHaveLength(2);
  });

  it("passes correct params to getSessions", async () => {
    mockGetSessions.mockResolvedValue([]);
    const loader = sessionLoader(config);
    await loader.loadCollection(collectionContext());

    expect(mockGetSessions).toHaveBeenCalledWith({
      limit: 24,
      sort: "date",
      order: "asc",
      status: ["SCHEDULED", "CONFIRMED"],
    });
  });

  it("passes oidcAudience to BackofficeClient", async () => {
    mockGetSessions.mockResolvedValue([]);
    const loader = sessionLoader({ ...config, oidcAudience: "my-audience" });
    await loader.loadCollection(collectionContext());

    const instance = (BackofficeClient as any).lastInstance;
    expect(instance.config).toEqual({
      baseUrl: "https://api.example.com",
      oidcConfig: {
        issuer: "https://auth.example.com",
        clientId: "client-id",
        clientSecret: "client-secret",
        audience: "my-audience",
      },
    });
  });

  it("has correct loader name", () => {
    const loader = sessionLoader(config);
    expect(loader.name).toBe("session-loader");
  });

  it("loadEntry returns matching entry by ID", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession()]);
    const loader = sessionLoader(config);
    const result = await loader.loadEntry({
      filter: { id: "kubernetes-workshop-2024-06-15" },
      collection: "session",
    });

    expect(result).toBeDefined();
    expect(result!.id).toBe("kubernetes-workshop-2024-06-15");
  });

  it("loadEntry returns undefined for non-existent ID", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession()]);
    const loader = sessionLoader(config);
    const result = await loader.loadEntry({
      filter: { id: "non-existent" },
      collection: "session",
    });

    expect(result).toBeUndefined();
  });
});
