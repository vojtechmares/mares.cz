import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig, envField } from "astro/config";
import { getContentPages } from "./src/lib/sitemap-pages.ts";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://www.mares.cz",

  redirects: {
    "/meeting/30min": "https://cal.com/vojtechmares/30min",
    "/meeting/1h": "https://cal.com/vojtechmares/1h",
    "/meeting/lunch": "https://cal.com/vojtechmares/lunch",
    "/meeting/beer": "https://cal.com/vojtechmares/beer",
  },

  i18n: {
    locales: ["cs", "en"],
    defaultLocale: "cs",
    routing: {
      prefixDefaultLocale: false,
    },
  },

  trailingSlash: "never",

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["@resvg/resvg-js"],
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },

  integrations: [
    react(),
    sitemap({
      customPages: getContentPages("https://www.mares.cz"),
      // i18n: {
      //   defaultLocale: "cs",
      //   locales: {
      //     cs: "cs-CZ",
      //     en: "en-US",
      //   },
      // },
    }),
  ],

  image: {
    domains: ["cdn.mares.cz"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.mares.cz",
      },
    ],
  },

  adapter: vercel({
    skewProtection: true,
    imageService: true,
    devImageService: "sharp",
    includeFiles: ["./src/fonts/Inter_18pt-Regular.ttf", "./src/fonts/Inter_18pt-Bold.ttf"],
  }),

  env: {
    schema: {
      SESSIONS_API_URL: envField.string({
        context: "server",
        access: "secret",
        default: "https://api.mares-skoleni.cz",
      }),
      SESSIONS_OIDC_ISSUER: envField.string({
        context: "server",
        access: "secret",
      }),
      SESSIONS_OIDC_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      SESSIONS_OIDC_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      SESSIONS_OIDC_AUDIENCE: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      ECOMAIL_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      ECOMAIL_TRAINING_LIST_ID: envField.string({
        context: "server",
        access: "secret",
        default: "2",
      }),
    },
  },
});
