# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website (mares.cz) built with Astro 5. The site is a bilingual (Czech/English) server-side rendered website that fetches content from Strapi CMS.

## Key Commands

**Development:**

- `pnpm dev` - Start development server at localhost:4321
- `pnpm build` - Build production site to ./dist/
- `pnpm preview` - Preview with Wrangler dev server

**Formatting & Linting:**

- `pnpm format` - Check formatting with Prettier (runs on pre-commit)
- `pnpm format:fix` - Auto-fix formatting issues
- `pnpm lint` - Check code with oxlint (runs on pre-commit)
- `pnpm lint:fix` - Auto-fix linting issues

Prettier is configured with:

- `prettier-plugin-astro` for .astro file support
- `prettier-plugin-tailwindcss` for automatic class sorting
- `htmlWhitespaceSensitivity: "ignore"` to prevent whitespace from affecting rendering

**Testing:**

- `pnpm test` - Run unit tests with Vitest
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ui` - Run tests with Vitest UI
- `npx playwright test` - Run E2E tests

**Package Manager:**

- Use `pnpm` exclusively (version 10.23.0 specified in packageManager field)

**Git Commits:**

- Use [Conventional Commits](https://www.conventionalcommits.org/) format for commit messages
- Always sign off commits with the `--signoff` flag (adds `Signed-off-by:` line)
- Common types: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`
- Example: `git commit --signoff -m "feat: add new feature"`

## Architecture

### Content Sources

The application pulls content from:

1. **Strapi CMS** (src/lib/strapi.ts)
   - Articles (blog posts)
   - Pages (static content pages)
   - Trainings (training course information)
   - Requires `STRAPI_API_URL` and `STRAPI_API_TOKEN` environment variables
   - All fetch methods return transformed TypeScript interfaces (Article, Page, Training)

2. **Sessions Content Collection** (src/content/session/)
   - Training sessions (scheduled public training dates)
   - Stored as JSON files in the content collection
   - Accessed via src/lib/sessions.ts helper functions

### Server Configuration

- **Astro Config** (astro.config.mjs):
  - Output mode: `server` (SSR enabled)
  - Adapter: Node.js in middleware mode
  - Default locale: Czech (`cs`), with English (`en`) support
  - Site URL: https://www.mares.cz
  - Meeting redirects configured to Cal.com

### Markdown Processing

Markdown content is converted to HTML using a unified processor pipeline (src/lib/markdown-to-html.ts):

- Supports GitHub Flavored Markdown (GFM)
- Syntax highlighting for 30+ languages via highlight.js
- Auto-generates heading slugs
- Allows raw HTML passthrough

### Dynamic Routes

The site uses Astro's file-based routing with dynamic segments:

- `/[slug]` - Generic pages from Strapi
- `/blog/[slug]` - Blog posts from Strapi
- `/skoleni/[slug]` - Training course pages from Strapi
- `/skoleni/verejne-terminy` - Public training sessions from content collection

Each dynamic route includes a `card.png.ts` file that generates Open Graph preview images using Satori.

### Testing

**Unit Tests** (Vitest + React Testing Library):

- Config: `vitest.config.ts`
- Tests: `tests/unit/**/*.test.{ts,tsx}`
- Setup: `tests/setup.ts`

**E2E Tests** (Playwright):

- Config: `playwright.config.ts`
- Tests: `tests/e2e/`

### Environment Variables

Required environment variables (defined in astro.config.mjs env schema):

- `STRAPI_API_URL` - Strapi CMS endpoint
- `STRAPI_API_TOKEN` - Strapi authentication token
- `DISABLE_ANALYTICS` - Boolean to disable Google Analytics (default: false)

### SEO Components

The site includes comprehensive SEO components (src/components/seo/):

- Meta tags (Meta.astro)
- Open Graph tags (OpenGraph.astro)
- Twitter Card tags (Twitter.astro)
- JSON-LD structured data (JSONLD.astro)
- Fediverse verification (Fediverse.astro)
- Custom favicons (Favicon.astro)

### Styling

- Tailwind CSS v4 configured via Vite plugin
- Typography plugin for prose content
