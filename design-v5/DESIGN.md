# mares.cz — design system

Technical, minimal, warm. One accent colour, hairline rules instead of shadows, monospace
for anything machine-shaped, and animated diagrams that carry the visual weight instead of
stock photography.

Reference implementation: `mares.cz.dc.html`. Token source: `design-tokens.ts`.

---

## 1. Principles

1. **One accent.** `--accent` orange is the only chromatic colour in the system. Everything
   else is warm neutral. If something needs emphasis and isn't accent-worthy, use weight or
   a rule, not a new colour.
2. **Rules, not shadows.** Depth is expressed with 1px hairlines. There are no box-shadows
   in the entire design. A card is a rectangle with a border.
3. **Warm neutrals, never gray.** Both backgrounds are hue-shifted toward orange
   (`#FAF8F5` / `#14120F`). A neutral gray next to this palette reads as a bug.
4. **Mono is semantic.** Monospace marks things that came from a machine: labels, paths,
   commands, prices, dates, figure captions, nav. Prose is sans. Never mono for body copy,
   never sans for a command.
5. **Diagrams replace imagery.** Every major concept gets a looping SVG/ASCII diagram in a
   bordered window with a figure number. This is the illustration budget — no photos except
   the author portrait, no icon sets.
6. **Airy, then dense.** Sections are widely spaced (88–104px); content inside them is
   tight and table-like. The contrast between the two is the rhythm.
7. **A person, not a company.** First-person copy, named byline, real capacity, real
   response time. Never "we".

---

## 2. Colour

Tokens live in `design-tokens.ts`. Apply as CSS custom properties on the app root and
reference with `var(--token)` everywhere.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#FAF8F5` | `#14120F` | page |
| `--surface` | `#FFFFFF` | `#1B1815` | cards, diagram windows, code blocks |
| `--ink` | `#1C1917` | `#F2EEE8` | headings, primary text, strong rules |
| `--muted` | `#6B655D` | `#A8A096` | body prose, secondary text |
| `--faint` | `#A39C92` | `#777066` | captions, units, meta |
| `--rule` | `#E4DED4` | `#2E2A25` | default hairline |
| `--rule2` | `#D9D2C7` | `#3E3831` | dashed / secondary hairline |
| `--shade`, `--shade2` | `#EEE9E1`, `#F6F2EC` | `#262220`, `#1F1C19` | placeholder hatch stripes |
| `--code` | `#F1ECE4` | `#242020` | inline `code` background |
| `--accent` | `#E8590C` | `#FF7A33` | links, eyebrows, active nav, primary button |
| `--accent2` | `#CF4E0A` | `#FF9457` | accent hover / pressed |
| `--on-accent` | `#FFFFFF` | `#14120F` | text on an accent fill |

**Dark mode is not an inversion.** Three values change behaviour, not just lightness:

- `--accent` lifts to `#FF7A33`; `#E8590C` on near-black is muddy and fails as a link colour.
- `--on-accent` flips to near-black. White on `#FF7A33` is ~2.6:1 and fails.
- `--surface` sits *above* `--bg` (`#1B1815` on `#14120F`), mirroring white-on-off-white.

Accent is used sparingly: eyebrow labels, links, the active nav underline, the primary
button, the capacity dot, and a single highlighted value per diagram. Never as a large fill,
never as a gradient, never two accents in one viewport competing.

---

## 3. Typography

- **Sans** — IBM Plex Sans (400 / 500 / 600). Prose, headings, row titles.
- **Mono** — JetBrains Mono (400 / 500). Everything machine-shaped.

Scale (see `type` in the token file for the full table):

| Role | Size / LH / tracking | Notes |
|---|---|---|
| Hero | 52px / 1.08 / −0.025em | 600 weight, one per page |
| Page title | 44px / 1.1 / −0.025em | subpage h1 |
| h2 | 32px / 1.15 / −0.02em | section heading |
| h3 | 28px / 1.2 / −0.02em | in-article heading |
| Lead | 19px / 1.55 | hero subhead, section intro, max 46ch |
| Body | 17px / 1.7 | article prose, max 60ch |
| Row title / body | 18px 500 / 15px | table-like rows |
| Mono UI | 13px / .02em | nav, buttons, labels, prices, dates |
| Mono small | 12px | diagram labels, eyebrows |
| Mono caption | 11px | `figcaption`, legal, footer bottom |

Rules: negative tracking on everything ≥28px, none below. Only 400/500/600 — no 700.
`text-wrap: pretty` on all headings and leads. Never centre a paragraph; headings are
left-aligned except inside a diagram.

---

## 4. Layout

- Container `1120px`, gutter `32px`, header `60px` with a bottom hairline and a
  `--bg-veil` blurred backdrop when sticky.
- Section padding: `96px 32px 72px` (first), `88px 32px 0` (middle), `88px 32px 104px` (last).
- Two-column sections are `minmax(0,1.05fr) minmax(0,1fr)` — text slightly wider than diagram.
- 4px spacing base; see `space`.
- Radii are tiny and meaningful: `2px` chips, `3px` buttons and diagram nodes, `4px` windows.
  Nothing is pill-shaped except a status dot (`50%`).

### Section numbering
Sections carry a mono eyebrow with a two-digit index and a slug: `01 / služby`. The number
is `--faint`, the slug `--accent`. This is the only decoration in the system.

---

## 5. Components

**Table-like row** — the workhorse. No cards. A `grid` with a `--rule` top border on each
row and a `--ink` border on the group's head. Columns: title (500, 18px), description
(15px `--muted`), value (13px mono, right-aligned, unit in `--faint`). Hover lightens the
background to `--shade2` only; no lift, no shadow.

**Diagram window** — `<figure>` with `1px solid var(--rule)`, `4px` radius, `--surface`
background, `24px 16px 16px` padding, and an italic 11px mono `<figcaption>` reading
`fig. NN — description`. Inside is either inline SVG (thin strokes, 1.25px) or a `<pre>`
ASCII box drawing. Every diagram is numbered and every number is unique per page.

**Button** — primary: `--accent` fill, `--on-accent` text, 500 weight 14px, `3px` radius,
`10px 16px`; hover `--accent2`. Secondary: transparent with `1px solid var(--ink)`, 13px
mono. There is no third button style.

**Code** — block: `--surface` on a `--rule` border, `4px` radius, `20px 24px`, 13px mono at
1.7. Inline: `--code` background, `1px 5px`, `2px` radius, no border. Shell prompts and
highlighted identifiers are `--accent`; nothing else is coloured. No syntax-highlighting
theme.

**Placeholder** — a `repeating-linear-gradient(135deg, var(--shade) 0 8px, var(--shade2) 8px 16px)`
hatch inside a `--rule` border. Used for the portrait and client logos until real assets land.
Dashed `--rule2` borders mean "empty / spare capacity" in diagrams.

**Theme switch** — header, left of the CTA: mono 12px, `1px solid var(--rule)`, a ring dot
that fills with `--accent` in dark mode, label reads `light` / `dark`. Choice persists in
`localStorage` under `mares-theme`; `documentElement.background` is set alongside so
overscroll matches.

---

## 6. Motion

Diagrams **loop forever** on a 12s linear cycle (`4s` ease-in-out for small pulses), driven
entirely by CSS `@keyframes` — no JS timeline, no scroll triggers, no entrance animations.
A visitor should be able to read the whole diagram at any random moment they arrive.

Named keyframes in the reference: `lit`, `litText`, `travel`, `dash`, `podDie`, `podSpawn`,
`statusFlip`, `blink`, `grow`, and `l1…l6` / `o1…o6` for the terminal's line-by-line typing.

UI transitions are 120ms ease-out and limited to colour and border-colour. Nothing moves on
hover. Honour `prefers-reduced-motion: reduce` by pausing loops at a legible resting frame —
never by hiding the diagram.

---

## 7. Implementation notes

1. Emit `cssVars(theme)` onto the root element; put `--bg`/`--ink` on it too so the whole
   tree inherits. Set `html { background }` to the same value to fix overscroll.
2. Load both fonts with `display=swap`; the two families are the only web fonts.
3. Diagram SVGs use `var(--token)` inside presentation attributes (`fill="var(--surface)"`),
   which is how they follow the theme for free. Keep stroke widths at `1.25`.
4. Copy is Czech, first person, and stays verbatim from the reference unless the content
   itself changes. Prices in CZK per day. The capacity line is real data — keep it current
   or remove it; a stale date is worse than none.
5. Accessibility floor: 4.5:1 for text. `--faint` at 11–13px passes on both backgrounds;
   do not use it above 13px or on `--surface` in dark mode without re-checking.
