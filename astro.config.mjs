// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import node from "@astrojs/node";

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
  },

  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: "cs",
        locales: {
          cs: "cs-CZ",
          en: "en-US",
        },
      },
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

  adapter: node({
    mode: "middleware",
  }),

  env: {
    schema: {
      STRAPI_API_URL: envField.string({
        context: "server",
        access: "public",
      }),
      STRAPI_API_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      NOTION_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      NOTION_TRAINING_SESSIONS_DATABASE_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      DISABLE_ANALYTICS: envField.boolean({
        context: "server",
        access: "public",
        default: false,
      }),
    },
  },
});
