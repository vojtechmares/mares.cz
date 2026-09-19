---
name: ui-components
description: The mares.cz v5 design system - CSS classes, Astro building blocks and looping diagrams. Reference this when creating or modifying any page, component or styling.
---

# mares.cz design system (v5)

Technical editorial minimalism: warm neutrals, one orange accent, hairlines instead of shadows,
monospace for anything machine-shaped, looping CSS diagrams instead of photography.

Spec: `design-v5/DESIGN.md`, `design-v5/DESIGN-BRIEF.md` (read them before designing anything new).
Tokens: `src/lib/design-tokens.ts` (TS) mirrored as CSS custom properties in `src/styles/global.css`.

## Hard rules

- Never hardcode a hex. Use `var(--bg | --surface | --ink | --muted | --faint | --rule | --rule2 | --shade | --shade2 | --code | --accent | --accent2 | --on-accent)`.
- One accent. No second colour, no gradients, no `box-shadow`, radii stop at 4px (`50%` only for status dots).
- No cards and no card grids - use table-like rows (`.rows` > `.row`).
- Mono (`var(--font-mono)`) only for machine-shaped text: nav labels, eyebrows, dates, prices, paths, commands, captions. Never for prose.
- Only weights 400 / 500 / 600. Negative tracking on text >= 28px only.
- UI transitions: `var(--ui)` (120ms ease-out) on colour / border-colour only. Nothing moves on hover.
- Both themes must work: `:root[data-theme="dark"]` swaps the tokens (persisted in `localStorage` as `mares-theme`).
- Pages are plain `.astro` with the global classes below. React is used only for interactive islands (newsletter form).

## Page skeleton

```astro
<Layout meta={meta} openGraph={openGraph}>
  <section class="section section--first">
    <div class="wrap">
      <p class="eyebrow">// Sekce</p>
      <h1 class="h-page">Titulek stránky</h1>
      <p class="lead lead--wide">Perex.</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap split">            <!-- text | diagram, 1.05fr / 1fr -->
      <div>
        <p class="eyebrow">01 — Služby</p>
        <h2 class="h2">Nadpis sekce</h2>
        <p class="body">Text.</p>
        <a class="link-arrow" href="…">Odkaz →</a>
      </div>
      <div class="split__media"><Pipeline n={1} … /></div>
    </div>
  </section>
</Layout>
```

The last `.section` inside `<main>` gets the 104px bottom padding automatically.

## Class reference (`src/styles/global.css`)

| Purpose | Classes |
|---|---|
| Container / rhythm | `.wrap`, `.section`, `.section--first`, `.section--last` |
| Two columns | `.split` (+ `.split--flip`, `.split--top`, child `.split__media`), `.aside-split` (heading column + rows column) |
| Section header with a right-aligned link | `.section-head` |
| Type | `.h-hero`, `.h-page`, `.h-post`, `.h2`, `.h3`, `.lead` (+ `.lead--wide`), `.lead-sm`, `.body`, `.note` (+ `.note--status` with `.dot`), `.eyebrow`, `.back-link`, `.mono` |
| Links / buttons | `.link`, `.link-arrow` (+ `.link-arrow--ink`), `.btn .btn--primary`, `.btn .btn--secondary` (there is no third button), `.actions` |
| Rows | `.rows` (+ `.rows--compact`) > `.row` with a column template: `.row--service`, `.row--service-wide`, `.row--course`, `.row--post` (+ `.row--post-lg`), `.row--step`, `.row--kv`, `.row--time`, `.row--session`, `.row--talk`; cells `.row__title`, `.row__desc`, `.row__value` (+ `--end`), `.row__unit`, `.row__meta`, `.row__num`, `.row__tag`, `.row__arrow` |
| Figures | `.fig` (diagram window), `.figcaption`, `.hatch` (placeholder / image backdrop), `.portrait`, `.avatar` (+ `--lg`, `--cutout`), `.byline` |
| Logos / marks | `.logos`, `.logo` (+ `--opaque`, `--inverse`), `.tech-mark` |
| Quotes | `.quotes` > `.quote` |
| Meta | `.meta-list` (dl), `.post-meta`, `.tags`, `.filter-bar` |
| Article | `.article-grid` (TOC + prose), `.toc`, `.prose` (+ `.prose--compact`) |
| Forms | `.panel`, `.form`, `.field`, `.field__label`, `.field__input`, `.field__error`, `.check` |

A `.row` is a CSS grid: every direct child is a cell. Wrap mixed inline content in one `<span>`.
An `<a class="row">` tints to `--shade2` on hover; non-link rows do not react.

## Astro building blocks

```
src/features/layout/   Header.astro | Footer.astro | ThemeScript.astro
src/features/shared/   ClientLogos | CourseRows | PostRows | ServiceRows | SessionRows | StepRows | Quotes | Portrait | Toc
src/features/blog/     BlogListing.astro | TrainingAd.astro
src/features/error/    ErrorPage.astro (standalone document for 404 / 500)
src/lib/               catalog.ts (getCatalog) | posts.ts (getPublishedPosts, toPostRow, readingTimeMinutes) | site.ts (PrimaryNavigation, Contact, SocialLinks, MeetingUrl)
```

## Diagrams (`src/components/diagrams/`, styles in `src/styles/diagrams.css`)

| Component | What it shows |
|---|---|
| `Figure.astro` | the bordered window + `fig. NN — caption`; wrap any custom diagram in it |
| `Pipeline.astro` | four nodes lit one after another (`nodes={[{label, sub} x4]}`) |
| `SelfHealing.astro` | three cluster nodes, a pod dies and respawns elsewhere |
| `Terminal.astro` | typed commands + output (`lines={[{cmd}|{out, hl?}]}`, unique `id` per page); scripts per training in `src/lib/training-terminals.ts` |
| `CostBars.astro` | before / after bar chart |
| `Seats.astro` | capacity of a public training session |

Motion contract: loops run forever on `--loop` (12s linear; 4s ease-in-out for small pulses), CSS only - no JS, no scroll triggers,
no entrance animations. Every frame must be legible on its own. The base (non-animated) style of each element is the resting frame:
`prefers-reduced-motion: reduce` switches the animations off, it never hides a diagram. Figure numbers are unique per page.
At most one accent-highlighted value per diagram state. Use `var(--token)` inside SVG presentation attributes and strokes of 1.25.

## Copy

Czech, first person singular, matter-of-fact, no "we", no superlatives, no exclamation marks. Strings live in
`src/i18n/translations/cs.ts`; English falls back to Czech for keys it does not have yet.
