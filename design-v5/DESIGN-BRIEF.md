# mares.cz — design brief for a developer

A short description of what this design *is*, so you can extend it without guessing.
For exact values see `DESIGN.md` and `design-tokens.ts`.

---

## One-line classification

**Technical editorial / documentation-style minimalism** — a developer-tool aesthetic
(PlanetScale, openstatus) applied to a one-person consultancy site, in a warm neutral
palette with a single orange accent and animated CSS diagrams instead of photography.

If you need a shorter label for a ticket: *monospace-accented technical minimalism, light
and dark, hairline-based, no shadows.*

---

## What it is not

Naming the neighbours it gets confused with is the fastest way to keep it consistent:

- **Not a SaaS marketing page.** No gradient hero, no glass cards, no floating screenshots
  at an angle, no "trusted by" carousel, no pricing tier cards with a highlighted middle.
- **Not brutalism.** It's restrained, not raw. Everything is aligned, tracked and spaced
  deliberately; there are no clashing colours, no oversized borders, no deliberate ugliness.
- **Not a Swiss/editorial portfolio.** No giant display type, no asymmetric grid games, no
  image-led layout. Content density is closer to documentation than to a magazine.
- **Not an agency site.** First-person copy, one named person, real capacity dates.
- **Not a terminal theme.** Monospace is used semantically, not decoratively; body prose is
  a humanist sans and the background is paper-warm, not black.

---

## The five decisions that define it

1. **One accent, everything else neutral.** Orange (`--accent`) marks links, eyebrow labels,
   the active nav underline, the primary button, and exactly one value per diagram. There is
   no secondary brand colour. Emphasis without accent is done with weight or a rule.

2. **Hairlines instead of shadows.** There is not a single `box-shadow` in the design.
   Structure comes from 1px borders in `--rule`. "Cards" are rectangles with a border and a
   4px radius; table-like rows are separated by top borders, with a heavier `--ink` rule
   above the group.

3. **Warm neutrals, never gray.** Both themes are hue-shifted toward orange —
   `#FAF8F5` light, `#14120F` dark. Dropping in a stock `neutral-50`/`zinc-900` will look
   broken next to this palette.

4. **Monospace is semantic.** JetBrains Mono marks anything machine-shaped: nav, labels,
   paths, commands, prices, dates, figure captions, IDs. IBM Plex Sans handles prose and
   headings. Never mono for body copy; never sans for a command.

5. **Animated diagrams carry the visual weight.** Each major section owns a numbered
   `<figure>` — a bordered window containing inline SVG (1.25px strokes) or ASCII box
   drawing, animated by pure CSS `@keyframes` on a 12s infinite loop. These replace the
   photography budget entirely. They are the brand.

---

## Structural pattern

```
header (60px, sticky, hairline bottom, blurred --bg-veil backdrop)
  wordmark · nav (mono, active item underlined in accent) · Školení dropdown
  theme switch · secondary CTA button

section  (max-width 1120px, gutter 32px, 88–104px vertical padding)
  eyebrow      mono 12px — "01 / služby", number in --faint, slug in --accent
  h2           32px/1.15, -0.02em
  content      two columns: minmax(0,1.05fr) diagram-side minmax(0,1fr)
               or a full-width stack of table-like rows

footer (hairline top, 4-column link list, mono legal line)
```

Rhythm is the point: sections are widely spaced, content inside them is dense and
table-like. Don't even out the spacing — the contrast is intentional.

---

## Component vocabulary

| Component | Shape |
|---|---|
| **Table-like row** | grid, top hairline per row, `--ink` rule above the group; title 18px/500, description 15px `--muted`, value 13px mono right-aligned with unit in `--faint`. Hover tints to `--shade2` only — no lift. |
| **Diagram window** | `<figure>`, 1px `--rule`, 4px radius, `--surface` fill, italic 11px mono caption `fig. NN — …`. |
| **Button** | Primary: accent fill, `--on-accent` text, 14px/500, 3px radius. Secondary: transparent, 1px `--ink` border, 13px mono. There is no third style. |
| **Code** | Block: `--surface` on `--rule`, 4px radius, 13px/1.7 mono. Inline: `--code` background, 2px radius. Only prompts and one highlighted identifier are accent; no syntax theme. |
| **Placeholder** | 135° repeating hatch between `--shade` and `--shade2` inside a hairline. Dashed `--rule2` = "empty / spare capacity" in diagrams. |
| **Nav dropdown** | Hover-opened panel under "Školení": two columns of courses (name + `days · level` in mono), a hairline-separated "Celý katalog →" row, chevron rotates 180°. |

---

## Motion contract

- Diagrams loop **forever**, 12s linear (4s ease-in-out for small pulses), CSS-only.
  No scroll triggers, no entrance animations, no JS timeline.
- The rule behind this: a visitor arrives at a random frame, so **every frame must be
  legible on its own**. Never animate a diagram from empty to full.
- UI transitions are 120ms ease-out, colour and border-colour only. Nothing moves on hover.
- `prefers-reduced-motion: reduce` → pause loops at a legible resting frame. Never hide
  the diagram.

---

## Theming

Emit `cssVars(theme)` from `design-tokens.ts` onto the root element and reference
`var(--token)` everywhere, including inside SVG presentation attributes
(`fill="var(--surface)"`) — that's how diagrams follow the theme for free.
Also set `html { background }` to the same value so overscroll matches.

**Dark mode is not an inversion.** Three tokens change behaviour, not just lightness:

- `--accent` lifts `#E8590C → #FF7A33`; the light orange goes muddy on near-black.
- `--on-accent` flips to near-black — white on `#FF7A33` is ~2.6:1 and fails.
- `--surface` sits *above* `--bg` (`#1B1815` on `#14120F`), mirroring white on off-white.

Theme choice persists in `localStorage` under `mares-theme`.

---

## Voice

Czech, first person singular, matter-of-fact. Concrete numbers over adjectives; prices in
CZK per day; a real capacity line with a real date. No "we", no superlatives, no
exclamation marks. The copy is part of the design — if it starts sounding like an agency,
the design stops working.

---

## Extending it — rules of thumb

- Adding a section? It gets a numbered mono eyebrow and, if it explains a process, a
  numbered diagram. Keep figure numbers unique per page.
- Tempted to add a colour? Use weight, a rule, or `--faint` instead.
- Tempted to add a shadow or a pill radius? Don't — radii stop at 4px, and the only circle
  in the system is a status dot.
- Tempted to add a card grid? Use table-like rows. The design deliberately has no cards.
- Accessibility floor is 4.5:1. `--faint` is safe at 11–13px only; re-check it anywhere
  larger, and on `--surface` in dark mode.
