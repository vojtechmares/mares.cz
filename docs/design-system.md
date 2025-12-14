# Design System

Design system for mares.cz following the **60/30/10 color principle**.

## 60/30/10 Principle

| Proportion | Role                    | Colors                 |
| ---------- | ----------------------- | ---------------------- |
| **60%**    | Neutral backgrounds     | `zinc-100`, `white`    |
| **30%**    | Primary text & elements | `zinc-900`, `zinc-700` |
| **10%**    | Accent highlights       | `amber-500`            |

---

## Color Palette

### Backgrounds (60% Neutral)

| Token                | Tailwind Class | Usage                 |
| -------------------- | -------------- | --------------------- |
| `background.default` | `bg-zinc-100`  | Page background       |
| `background.surface` | `bg-white`     | Cards, content areas  |
| `background.inverse` | `bg-zinc-900`  | Dark sections, footer |

### Text (30% Primary)

| Token            | Tailwind Class  | Usage                    |
| ---------------- | --------------- | ------------------------ |
| `text.primary`   | `text-zinc-900` | Headings, main text      |
| `text.secondary` | `text-zinc-700` | Body text, paragraphs    |
| `text.muted`     | `text-zinc-500` | Captions, metadata       |
| `text.inverse`   | `text-white`    | Text on dark backgrounds |

### Accent (10%)

| Token            | Tailwind Class       | Usage                    |
| ---------------- | -------------------- | ------------------------ |
| `accent.default` | `bg-amber-500`       | CTA buttons              |
| `accent.hover`   | `hover:bg-amber-600` | Button hover states      |
| `accent.text`    | `text-amber-500`     | Accent text, highlights  |
| `accent.light`   | `bg-amber-100`       | Light accent backgrounds |

### Borders

| Token            | Tailwind Class    | Usage            |
| ---------------- | ----------------- | ---------------- |
| `border.default` | `border-zinc-200` | Standard borders |
| `border.muted`   | `border-zinc-300` | Dividers         |

---

## Typography

### Headings

| Level | Classes                            | Mobile | Desktop |
| ----- | ---------------------------------- | ------ | ------- |
| h1    | `text-4xl sm:text-5xl font-bold`   | 36px   | 48px    |
| h2    | `text-3xl sm:text-4xl font-bold`   | 30px   | 36px    |
| h3    | `text-2xl sm:text-3xl font-medium` | 24px   | 30px    |
| h4    | `text-xl sm:text-2xl font-medium`  | 20px   | 24px    |
| h5    | `text-lg sm:text-xl font-medium`   | 18px   | 20px    |
| h6    | `text-base sm:text-lg font-medium` | 16px   | 18px    |

### Body Text

| Size  | Class       | Usage              |
| ----- | ----------- | ------------------ |
| Large | `text-lg`   | Lead paragraphs    |
| Base  | `text-base` | Standard body text |
| Small | `text-sm`   | Secondary info     |

### Display

All headings use: `font-display tracking-tight`

---

## Spacing

### Section Padding

| Size | Classes          | Mobile | Desktop |
| ---- | ---------------- | ------ | ------- |
| sm   | `py-12 sm:py-16` | 48px   | 64px    |
| md   | `py-20 sm:py-32` | 80px   | 128px   |
| lg   | `py-32 sm:py-40` | 128px  | 160px   |

### Component Spacing

| Element   | Classes             |
| --------- | ------------------- |
| Card      | `px-4 py-8 sm:px-8` |
| Container | `px-4 lg:px-8`      |

### Gap Scale

| Size | Class   | Value |
| ---- | ------- | ----- |
| xs   | `gap-1` | 4px   |
| sm   | `gap-2` | 8px   |
| md   | `gap-4` | 16px  |
| lg   | `gap-6` | 24px  |
| xl   | `gap-8` | 32px  |

---

## Border Radius

| Size | Class          | Usage          |
| ---- | -------------- | -------------- |
| none | `rounded-none` | Sharp edges    |
| sm   | `rounded-lg`   | Small elements |
| md   | `rounded-2xl`  | Cards          |
| lg   | `rounded-3xl`  | Large cards    |
| full | `rounded-full` | Pills, buttons |

---

## Shadows

| Size | Class         | Usage            |
| ---- | ------------- | ---------------- |
| none | `shadow-none` | Flat elements    |
| sm   | `shadow-sm`   | Subtle elevation |
| md   | `shadow-md`   | Cards            |
| lg   | `shadow-lg`   | Modals, popovers |

---

## Usage

```typescript
import { colors, typography, spacing } from "@/lib/design-tokens";

// In components
const bgClass = colors.background.surface; // "bg-white"
const textClass = colors.text.primary; // "text-zinc-900"
const h1Style = typography.heading.h1; // "text-4xl sm:text-5xl font-bold"
```

---

## Reference

See `src/lib/design-tokens.ts` for full token definitions.
