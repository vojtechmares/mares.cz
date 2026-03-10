import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "astro:actions": new URL("./tests/mocks/astro-actions.ts", import.meta.url).pathname,
      "astro:content": new URL("./tests/mocks/astro-content.ts", import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      include: ["src/components/**/*.tsx", "src/features/**/*.tsx", "src/lib/**/*.ts"],
      exclude: [
        "src/lib/backoffice/types.ts",
        "src/lib/cache.ts",
        "src/lib/site.ts",
        "src/lib/design-tokens.ts",
        "src/lib/opengraph.ts",
        "src/lib/sitemap-pages.ts",
        "src/features/opengraph-images/**",
        "src/lib/backoffice/index.ts",
      ],
    },
  },
});
