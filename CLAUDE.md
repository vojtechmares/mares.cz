# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website (mares.cz) built with Astro 5, deployed as a containerized application to Kubernetes. The site is a bilingual (Czech/English) server-side rendered website that fetches content from Strapi CMS.

## Key Commands

**Development:**

- `pnpm dev` - Start development server at localhost:4321
- `pnpm build` - Build production site to ./dist/
- `pnpm run-like-prod` - Build and run with production server (Fastify)
- `pnpm preview` - Build and preview with Wrangler dev server

**Formatting:**

- `pnpm format:fix` - Auto-fix formatting issues with Prettier
- `pnpm format:check` - Check formatting (runs on pre-commit via Husky)

**Docker:**

- `task docker:build` - Build Docker image with production secrets from .prod.env
- `task docker:run` - Run Docker container locally with production environment variables

**Deployment:**

- `pnpm deploy` - Build and deploy to Cloudflare Workers
- Container builds happen automatically via GitHub Actions on push to main

**Package Manager:**

- Use `pnpm` exclusively (version 10.23.0 specified in packageManager field)
- Use `task` for Docker operations (configured in Taskfile.yml)

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

- **Production Server** (server.mjs):
  - Fastify server running on port 8080
  - Serves static assets from dist/client with aggressive caching (1 year)
  - Liveness probe at `/_/livez`
  - SSR handler integrated via @fastify/middie

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

### Deployment

**Container Build:**

- Multi-stage Dockerfile optimized for Node.js 24 Alpine
- Build-time secrets injected for CMS access
- Runs as non-root user (nodejs)
- Exposes port 8080

**CI/CD:**

- GitHub Actions workflow builds and pushes to GHCR on main branch
- Automatic deployment to staging environment (beta.mares.cz)
- Helm charts in deploy/k8s/ directory
- Kubernetes secrets managed via External Secrets Operator

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
- Custom Prettier plugins for Astro and Tailwind class sorting
