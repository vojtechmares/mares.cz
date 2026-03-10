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
  pricing_currency: "CZK",
  pricing_amount: 15000,
  status: "SCHEDULED",
  signup_url: "https://example.com/signup",
  create_time: "2024-01-01T00:00:00Z",
  update_time: "2024-01-01T00:00:00Z",
  delete_time: null,
  purge_time: null,
  ...overrides,
});

describe("sessionLoader", () => {
  let mockStore: { clear: ReturnType<typeof vi.fn>; set: ReturnType<typeof vi.fn> };
  let mockLogger: { info: ReturnType<typeof vi.fn> };
  let mockParseData: ReturnType<typeof vi.fn>;
  let mockGenerateDigest: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockStore = { clear: vi.fn(), set: vi.fn() };
    mockLogger = { info: vi.fn() };
    mockParseData = vi.fn(({ data }) => Promise.resolve(data));
    mockGenerateDigest = vi.fn(() => "digest-123");
    mockGetSessions = vi.fn();
  });

  const config = {
    apiUrl: "https://api.example.com",
    oidcIssuer: "https://auth.example.com",
    clientId: "client-id",
    clientSecret: "client-secret",
  };

  const loadContext = () =>
    ({
      store: mockStore,
      logger: mockLogger,
      parseData: mockParseData,
      generateDigest: mockGenerateDigest,
    }) as any;

  it("generates session ID from slugified name and date", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession()]);
    const loader = sessionLoader(config);
    await loader.load(loadContext());

    expect(mockStore.set).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "kubernetes-workshop-2024-06-15",
      }),
    );
  });

  it("transforms API session to content data", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession()]);
    const loader = sessionLoader(config);
    await loader.load(loadContext());

    expect(mockParseData).toHaveBeenCalledWith({
      id: "kubernetes-workshop-2024-06-15",
      data: {
        trainingID: 10,
        name: "Kubernetes Workshop",
        dates: { start: "2024-06-15", end: "2024-06-16" },
        location: "Praha",
        price: 15000,
        signUpURL: "https://example.com/signup",
      },
    });
  });

  it("calculates end date for multi-day sessions", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession({ length: 3 })]);
    const loader = sessionLoader(config);
    await loader.load(loadContext());

    const parseCall = mockParseData.mock.calls[0][0];
    expect(parseCall.data.dates.end).toBe("2024-06-17");
  });

  it("omits end date for single-day sessions", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession({ length: 1 })]);
    const loader = sessionLoader(config);
    await loader.load(loadContext());

    const parseCall = mockParseData.mock.calls[0][0];
    expect(parseCall.data.dates.end).toBeUndefined();
  });

  it("omits signUpURL when null", async () => {
    mockGetSessions.mockResolvedValue([createMockAPISession({ signup_url: null })]);
    const loader = sessionLoader(config);
    await loader.load(loadContext());

    const parseCall = mockParseData.mock.calls[0][0];
    expect(parseCall.data.signUpURL).toBeUndefined();
  });

  it("clears store before loading", async () => {
    mockGetSessions.mockResolvedValue([]);
    const loader = sessionLoader(config);
    await loader.load(loadContext());

    expect(mockStore.clear).toHaveBeenCalled();
  });

  it("loads multiple sessions", async () => {
    mockGetSessions.mockResolvedValue([
      createMockAPISession({ id: 1, training_name: "K8s" }),
      createMockAPISession({ id: 2, training_name: "Docker" }),
    ]);
    const loader = sessionLoader(config);
    await loader.load(loadContext());

    expect(mockStore.set).toHaveBeenCalledTimes(2);
  });

  it("passes correct params to getSessions", async () => {
    mockGetSessions.mockResolvedValue([]);
    const loader = sessionLoader(config);
    await loader.load(loadContext());

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
    await loader.load(loadContext());

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
});
