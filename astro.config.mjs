// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://www.mares.cz",

    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [react(), sitemap()],
});
