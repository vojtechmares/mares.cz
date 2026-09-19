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
- `/skoleni/` - Training catalog | `/skoleni/[slug]/` - Training courses | `/skoleni/verejne-terminy` - Public sessions
- `/o-mne/` - About | `/kontakt/` - Contact (Czech only for now)
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

### Styling (design v5)

Spec in `design-v5/DESIGN.md` + `design-v5/DESIGN-BRIEF.md`. Global CSS in `src/styles/global.css` (tokens, layout, rows, prose) and `src/styles/diagrams.css` (looping figures). Tailwind v4 is still loaded (preflight + utilities) but pages use the semantic global classes. Light/dark via `:root[data-theme]`, persisted in `localStorage` as `mares-theme` (`src/features/layout/ThemeScript.astro`). See the `ui-components` skill for the full class and component reference.

---

## Building blocks

```
Layout|src/layouts/Layout.astro|meta?|openGraph?|jsonLd?|alternateUrls? (Header + Footer + ThemeScript)
Header|src/features/layout/Header.astro|sticky, Školení dropdown from getCatalog(), theme switch, mobile <details> menu
Footer|src/features/layout/Footer.astro|4 columns, language link
CourseRows|src/features/shared/CourseRows.astro|courses:CatalogItem[]|compact?:boolean
ServiceRows|src/features/shared/ServiceRows.astro|variant?:"default"|"wide"|linked?:boolean
PostRows|src/features/shared/PostRows.astro|posts:PostRow[]{href,title,date,tag?,meta?}|size?:"default"|"lg"
SessionRows|src/features/shared/SessionRows.astro|sessions:TrainingSession[]|compact?:boolean
StepRows|src/features/shared/StepRows.astro|steps:{name,description,value?}[]
Quotes|src/features/shared/Quotes.astro|limit?:number (reference collection)
ClientLogos|src/features/shared/ClientLogos.astro|monochrome client logo strip
Portrait|src/features/shared/Portrait.astro|variant?:"frame"|"avatar"|"avatar-lg"|loading?
Toc|src/features/shared/Toc.astro|headings:MarkdownHeading[]|title:string|maxDepth?:number
BlogListing|src/features/blog/BlogListing.astro|title|lead?|back?|articles|tags?|activeTag?|links?|linksLabel?
TrainingAd|src/features/blog/TrainingAd.astro|trainingSlug:string|n?:number
ErrorPage|src/features/error/ErrorPage.astro|status:404|500|detail?:string
Figure|src/components/diagrams/Figure.astro|n|caption|inlineCaption? (diagram window)
Pipeline|src/components/diagrams/Pipeline.astro|n|caption|nodes:[{label,sub} x4]
SelfHealing|src/components/diagrams/SelfHealing.astro|n|caption?
Terminal|src/components/diagrams/Terminal.astro|n|caption|id(unique per page)|lines:TerminalLine[]|chrome?
CostBars|src/components/diagrams/CostBars.astro|n|caption|before|after
Seats|src/components/diagrams/Seats.astro|n|caption|min?|max?
```

NOTE: figure numbers (`n`) must be unique per page. Diagrams are CSS-only 12s loops; the base style is the reduced-motion resting frame.

## Utility Reference

```
design-tokens|src/lib/design-tokens.ts (v5, mirrored as CSS custom properties in global.css)
  color.{light,dark}.{bg,surface,ink,muted,faint,rule,rule2,shade,shade2,code,accent,accent2,onAccent,bgVeil}
  font.{sans,mono}|type.{hero,pageTitle,postTitle,h2,h3,lead,rowTitle,body,bodySm,rowBody,uiSans,monoUi,monoSm,monoXs,monoXxs}
  space|layout.{maxWidth,gutter,section*,proseWidth,measure,headerHeight}|radius.{none,xs,sm,md,lg,full}|border|motion
  cssVars(theme):Record<string,string>

catalog|src/lib/catalog.ts
  getCatalog(locale):Promise<CatalogItem[]> - published trainings, featured first
  CatalogItem{slug,title,description,length,featured,priceOpen,priceCorporate,icon?}

posts|src/lib/posts.ts
  getPublishedPosts(locale)|toPostRow(post,locale)|readingTimeMinutes(body)

cache|src/lib/cache.ts
  CachePresets.content="public, s-maxage=3600, stale-while-revalidate=86400"
  CachePresets.archive="public, s-maxage=1800, stale-while-revalidate=3600"
  CachePresets.training="public, s-maxage=300, stale-while-revalidate=600"
  CachePresets.ogImage="public, max-age=31536000, immutable"

site|src/lib/site.ts
  LocalizedMetadata[]{locale,title,titlePrefix,description,keywords}
  PrimaryNavigation[]{key,href,match[]}|MeetingUrl|Contact{name,email,phone,...}|SocialLinks[]{name,href}

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
Page structure:    Layout > section.section > div.wrap(.split|.aside-split) > global classes / shared .astro blocks
React in Astro:   Only for interactive islands (newsletter form, client:load); everything else is .astro
Feature modules:  src/features/{domain}/ - shared, blog, training, layout, opengraph-images, error
OG images:        Every route has card.png.ts using OpenGraphImageResponse() from src/lib/opengraph.ts
Styling:          Global semantic classes + var(--token); never hardcode a hex, no shadows, one accent (see ui-components skill)
Date format:      toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })
Price format:     new Intl.NumberFormat("cs", { style: "currency", currency: "CZK", maximumFractionDigits: 0 })
```
