// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
    output: "server",
    site: "https://www.mares.cz",

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

    adapter: cloudflare({
        imageService: "cloudflare",
    }),
});
