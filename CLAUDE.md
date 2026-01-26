# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website (mares.cz) built with Astro 5. The site is a server-side rendered website deployed to Cloudflare Workers.

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

### Content Collections

All content is managed via Astro Content Collections (src/content.config.ts):

1. **blog** - Blog posts as markdown files (src/content/blog/)
2. **page** - Static pages as markdown (src/content/page/)
3. **training** - Training course information (src/content/training/)
4. **reference** - Customer references/testimonials (src/content/reference/)
5. **talk** - Conference talks (src/content/talk/)
6. **session** - Public training sessions loaded from external backoffice API via custom loader (src/lib/loaders/session-loader.ts)

### Server Configuration

- **Astro Config** (astro.config.mjs):
  - Output mode: `server` (SSR enabled)
  - Adapter: Cloudflare Workers
  - Site URL: https://www.mares.cz
  - Meeting redirects configured to Cal.com
  - i18n: Currently disabled (Czech only)

### Dynamic Routes

The site uses Astro's file-based routing:

- `/[...slug]/` - Generic pages from content collection
- `/blog/[slug]/` - Blog posts
- `/blog/tag/[tag]/` - Blog posts filtered by tag
- `/blog/archive/[year]/` and `/blog/archive/[year]/[month]/` - Blog archive
- `/skoleni/[slug]/` - Training course pages
- `/skoleni/verejne-terminy` - Public training sessions
- `/prednasky/` - Conference talks

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

- `DISABLE_ANALYTICS` - Boolean to disable Google Analytics (default: false)
- `SESSIONS_API_URL` - Backoffice API endpoint for training sessions
- `SESSIONS_OIDC_ISSUER` - OIDC issuer URL for API authentication
- `SESSIONS_OIDC_CLIENT_ID` - OIDC client ID
- `SESSIONS_OIDC_CLIENT_SECRET` - OIDC client secret
- `SESSIONS_OIDC_AUDIENCE` - OIDC audience (optional)

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
- UI components in src/components/ui/ (React)
