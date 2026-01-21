import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://www.mares.cz",

  redirects: {
    "/meeting/30min": "https://cal.com/vojtechmares/30min",
    "/meeting/1h": "https://cal.com/vojtechmares/1h",
    "/meeting/lunch": "https://cal.com/vojtechmares/lunch",
    "/meeting/beer": "https://cal.com/vojtechmares/beer",
  },

  // Disable localization for now, until it is actually complete
  // i18n: {
  //   locales: ["cs", "en"],
  //   defaultLocale: "cs",
  //   routing: {
  //     prefixDefaultLocale: false,
  //   },
  // },

  trailingSlash: "never",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    sitemap({
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

  adapter: cloudflare({
    imageService: "compile", // transform images with sharp for now
  }),

  env: {
    schema: {
      DISABLE_ANALYTICS: envField.boolean({
        context: "server",
        access: "public",
        default: false,
      }),
    },
  },
});
