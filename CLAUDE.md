# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website (mares.cz) built with Astro 6. The site is a server-side rendered website deployed to Vercel (project `mares-cz`) via the `@astrojs/vercel` adapter, with serverless functions in the `fra1` (Frankfurt) region.

IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any Astro 6 tasks. Read project files before assuming API patterns.

## Key Commands

**Development:**

- `pnpm dev` - Start development server at localhost:4321
- `pnpm build` - Build production site to ./dist/
- `vercel dev` - Run the app locally through the Vercel runtime (closest to production)

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

### Content Collections (src/content.config.ts)

- **blog** - Markdown posts (src/content/blog/), has `draft` and `publish_time` fields
- **page** - Static pages as markdown (src/content/page/)
- **training** - Training courses (src/content/training/), has `backofficeID` field
- **reference** - Customer testimonials (src/content/reference/)
- **talk** - Conference talks (src/content/talk/)
- **session** - Public training sessions from external API via custom loader (src/lib/loaders/session-loader.ts)

### Server Config (astro.config.mjs)

Output: `server` (SSR) | Adapter: `@astrojs/vercel` (region `fra1`, skewProtection) | Site: https://www.mares.cz | Czech + English (i18n)

### Routes

- `/[...slug]/` - Pages | `/blog/[slug]/` - Posts | `/blog/tag/[tag]/` - By tag
- `/blog/archive/[year]/` and `/blog/archive/[year]/[month]/` - Archive
- `/skoleni/[slug]/` - Training courses | `/skoleni/verejne-terminy` - Public sessions
- `/prednasky/` - Talks
- Each route has `card.png.ts` for OG images via Satori + workers-og

### Testing

- Unit: Vitest + React Testing Library | Config: `vitest.config.ts` | Tests: `tests/unit/**/*.test.{ts,tsx}`
- E2E: Playwright | Config: `playwright.config.ts` | Tests: `tests/e2e/`

### Environment Variables (astro.config.mjs env schema)

- `SESSIONS_API_URL` - Backoffice API endpoint
- `SESSIONS_OIDC_ISSUER`, `SESSIONS_OIDC_CLIENT_ID`, `SESSIONS_OIDC_CLIENT_SECRET` - OIDC auth
- `SESSIONS_OIDC_AUDIENCE` - OIDC audience (optional)

### SEO (src/components/seo/)

Meta.astro | OpenGraph.astro | Twitter.astro | JSONLD.astro | Fediverse.astro | Favicon.astro

### Styling

Tailwind CSS v4 via Vite plugin | Typography plugin for prose | UI components in src/components/ui/ (React)

---

## Component API Reference

<!-- Dense reference: Component|path|prop:type(default)|... -->

```
Button|src/components/ui/button.tsx|style?:"solid"(default)|"outline"|variant?:"primary"(default)|"secondary"|"accent"|size?:"medium"|"large"(default)|href?:string(renders <a>)|type?:string|onClick?:fn(button only)|children
Heading|src/components/ui/heading.tsx|level?:"h1"(default)-"h6"|variant?:"primary"(default)|"inverse"|"accent"|id?:string|ariaLabel?:string|children
Container|src/components/ui/container.tsx|mode?:"default"(default)|"prose"|className?:string|children
Section|src/components/ui/section.tsx|variant?:"default"(default)|"surface"|"inverse"|"accent"|id?:string|ariaLabel?:string|children
Body|src/components/ui/body.tsx|variant?:"large"|"base"(default)|"small"|color?:"primary"(default)|"secondary"|"muted"|"inverse"|as?:"p"(default)|"span"|"div"|children
Text|src/components/ui/text.tsx|variant?:"primary"(default)|"secondary"|"muted"|"inverse"|children (renders <p>)
Card|src/components/ui/card.tsx|variant?:"default"(default)|"surface"|"inverse"|"accent"|"accent-light"|border?:"none"|shadow?:boolean|hover?:boolean|children (renders <section>)
Badge|src/components/ui/badge.tsx|variant?:"default"(default)|"accent"|as?:"span"(default)|"a"|href?:string(when as="a")|children
Link|src/components/ui/link.tsx|href:string|variant?:"default"(default)|"muted"|external?:boolean|children
Stack|src/components/ui/stack.tsx|direction?:"vertical"(default)|"horizontal"|gap?:GapSize("md")|align?:"start"|"center"|"end"|"stretch"|justify?:"start"|"center"|"end"|"between"|"around"|children
Icon|src/components/ui/icon.tsx|size?:"sm"|"md"(default)|"lg"|label?:string|children
TagList|src/components/ui/tag-list.tsx|tags:string[]|variant?:"default"|"inverse"|activeTag?:string|locale?:Locale("cs")
Prose|src/components/prose.tsx|className?:string|children (wraps rendered markdown Content)
```

NOTE: `style="outline"` + `variant="accent"` on Button is invalid (throws error).

## Utility Reference

```
design-tokens|src/lib/design-tokens.ts
  colors.background.{default,surface,inverse}
  colors.text.{primary,secondary,muted,inverse,link,linkHover}
  colors.accent.{default,hover,text,light}
  colors.border.{default,hover,dark,emphasis}
  typography.heading.{h1-h6}|typography.body.{large,base,small}|typography.display
  spacing.{section,card,container}|spacing.maxWidth.{standard,prose}|spacing.gap.{xs,sm,md,lg,xl,2xl,3xl}
  radius.{none,sm,md,lg,full} (all rounded-none)|shadows.{none,sm,md,lg}
  Types: BackgroundColor|TextColor|AccentColor|BorderColor|HeadingLevel|BodySize|GapSize|RadiusSize|ShadowSize

cache|src/lib/cache.ts
  CachePresets.content="public, s-maxage=3600, stale-while-revalidate=86400"
  CachePresets.archive="public, s-maxage=1800, stale-while-revalidate=3600"
  CachePresets.training="public, s-maxage=300, stale-while-revalidate=600"
  CachePresets.ogImage="public, max-age=31536000, immutable"

site|src/lib/site.ts
  LocalizedMetadata[]{locale,title,titlePrefix,description,keywords}
  LocalizedStaticNavigationLinks[]{locale,links[]{name,href}}
  Type: StaticLinkData{name,href}

sessions|src/lib/sessions.ts
  getFutureSessions():Promise<Session[]> - sorted ascending by start date
  getFutureSessionsByName(name):Promise<Session[]>
  toTrainingSession(session):TrainingSession{trainingID,trainingSlug?,name,dates:{start,end?},location,price,signUpURL?}
  getTrainingIDToSlugMap():Promise<Map<number,string>>
  enrichSessionsWithSlugs(sessions,slugMap):TrainingSession[]

opengraph|src/lib/opengraph.ts
  OpenGraphImageResponse(component:ReactNode,baseUrl:string|URL):Promise<Response>
  imageToDataUrl(imageUrl:string,baseUrl:string|URL):Promise<string>
```

## Content Collections Quick Reference

```
Query:    import { getEntry, getCollection, render } from "astro:content"
Blog:     getCollection("blog", ({ data }) => !data.draft)
Sort:     .sort((a, b) => b.data.publish_time.valueOf() - a.data.publish_time.valueOf())
Render:   const { Content } = await render(entry)
404:      if (!entry || entry.data.draft) return Astro.redirect("/404", 404)
Cache:    Astro.response.headers.set("Cache-Control", CachePresets.content)
```

## Key Patterns

```
Page structure:    Layout > main > Section(variant) > Container > components
React in Astro:   Import React TSX, use directly (server-rendered, no client: directive needed for static)
Feature modules:  src/features/{domain}/{component}.tsx - blog, training, homepage, layout, opengraph-images, error
OG images:        Every route has card.png.ts using OpenGraphImageResponse() from src/lib/opengraph.ts
Styling:          Use design-tokens.ts values via clsx(), not raw Tailwind classes for themed properties
Date format:      toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })
Price format:     new Intl.NumberFormat("cs", { style: "currency", currency: "CZK", maximumFractionDigits: 0 })
```
