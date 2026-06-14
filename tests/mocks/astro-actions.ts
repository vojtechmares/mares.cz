import { vi } from "vitest";

export const actions = {
  newsletter: {
    signup: vi.fn(),
  },
};

// No-op stubs so modules importing the server-side helpers don't break under Vitest.
export const defineAction = vi.fn((config) => config);
export const isInputError = vi.fn(() => false);
