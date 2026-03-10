import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCollection } from "astro:content";

import {
  toTrainingSession,
  enrichSessionsWithSlugs,
  getFutureSessions,
  getFutureSessionsByName,
  getTrainingIDToSlugMap,
} from "../../../src/lib/sessions";

const createMockSessionEntry = (overrides: Record<string, unknown> = {}) => ({
  id: "test-session",
  collection: "session" as const,
  data: {
    trainingID: 1,
    name: "Kubernetes Workshop",
    dates: { start: "2099-06-15" },
    location: "Praha",
    price: 15000,
    signUpURL: "https://example.com/signup",
    ...((overrides.data as Record<string, unknown>) ?? {}),
  },
  ...Object.fromEntries(Object.entries(overrides).filter(([k]) => k !== "data")),
});

describe("toTrainingSession", () => {
  it("transforms session entry to TrainingSession", () => {
    const entry = createMockSessionEntry();
    const result = toTrainingSession(entry as any);
    expect(result).toEqual({
      trainingID: 1,
      name: "Kubernetes Workshop",
      dates: { start: "2099-06-15" },
      location: "Praha",
      price: 15000,
      signUpURL: "https://example.com/signup",
    });
  });
});

describe("enrichSessionsWithSlugs", () => {
  it("adds trainingSlug from map", () => {
    const sessions = [{ trainingID: 1, name: "K8s", dates: { start: "2099-01-01" }, location: "Praha", price: 10000 }];
    const map = new Map([[1, "kubernetes"]]);
    const result = enrichSessionsWithSlugs(sessions, map);
    expect(result[0].trainingSlug).toBe("kubernetes");
  });

  it("leaves trainingSlug undefined when not in map", () => {
    const sessions = [{ trainingID: 99, name: "K8s", dates: { start: "2099-01-01" }, location: "Praha", price: 10000 }];
    const map = new Map([[1, "kubernetes"]]);
    const result = enrichSessionsWithSlugs(sessions, map);
    expect(result[0].trainingSlug).toBeUndefined();
  });
});

describe("getFutureSessions", () => {
  beforeEach(() => {
    vi.mocked(getCollection).mockReset();
  });

  it("filters past sessions and sorts ascending by start date", async () => {
    const sessions = [
      createMockSessionEntry({ id: "future-2", data: { dates: { start: "2099-12-01" } } }),
      createMockSessionEntry({ id: "past", data: { dates: { start: "2020-01-01" } } }),
      createMockSessionEntry({ id: "future-1", data: { dates: { start: "2099-06-01" } } }),
    ];
    vi.mocked(getCollection).mockResolvedValue(sessions as any);
    const result = await getFutureSessions();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("future-1");
    expect(result[1].id).toBe("future-2");
  });
});

describe("getFutureSessionsByName", () => {
  beforeEach(() => {
    vi.mocked(getCollection).mockReset();
  });

  it("filters by name case-insensitively", async () => {
    const sessions = [
      createMockSessionEntry({ id: "s1", data: { name: "Kubernetes Workshop", dates: { start: "2099-06-01" } } }),
      createMockSessionEntry({ id: "s2", data: { name: "Docker Workshop", dates: { start: "2099-06-01" } } }),
    ];
    vi.mocked(getCollection).mockResolvedValue(sessions as any);
    const result = await getFutureSessionsByName("kubernetes workshop");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("s1");
  });
});

describe("getTrainingIDToSlugMap", () => {
  beforeEach(() => {
    vi.mocked(getCollection).mockReset();
  });

  it("builds map from training collection", async () => {
    const trainings = [
      { id: "kubernetes", data: { backofficeID: 10 } },
      { id: "docker", data: { backofficeID: 20 } },
    ];
    vi.mocked(getCollection).mockResolvedValue(trainings as any);
    const map = await getTrainingIDToSlugMap();
    expect(map.get(10)).toBe("kubernetes");
    expect(map.get(20)).toBe("docker");
  });

  it("excludes drafts with backofficeID <= 0", async () => {
    const trainings = [
      { id: "draft", data: { backofficeID: -1 } },
      { id: "zero", data: { backofficeID: 0 } },
      { id: "valid", data: { backofficeID: 5 } },
    ];
    vi.mocked(getCollection).mockResolvedValue(trainings as any);
    const map = await getTrainingIDToSlugMap();
    expect(map.size).toBe(1);
    expect(map.get(5)).toBe("valid");
  });
});
