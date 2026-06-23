# Design System Manual

Kompletni specifikace vizualniho stylu pro mares.cz. Tento dokument slouzi jako jediny zdroj pravdy pro design a vyvoj webu.

**Source:** https://www.tkajart.cz/manual-vojtech-mares/

---

## 1. Typografie

Monospace system pro technicky vzhled - Inter pro nadpisy, Space Mono pro text i kod.

### Fonts

| Font           | Role      | Usage                                          |
| -------------- | --------- | ---------------------------------------------- |
| **Inter**      | Display   | Vsechny nadpisy (H1-H6)                        |
| **Space Mono** | Body      | Bezny text, odstavce, formulare, UI komponenty |
| **Space Mono** | Code/Data | Code bloky, technicka data                     |

**Google Fonts:** Inter, Space Mono (zdarma)

### Typograficka Skala

| Element | Velikost        | Font / Vaha              | Line-height | Pouziti            |
| ------- | --------------- | ------------------------ | ----------- | ------------------ |
| H1      | 48px / 3rem     | Inter Bold (700)         | 1.1         | Hero sekce         |
| H2      | 36px / 2.25rem  | Inter SemiBold (600)     | 1.2         | Hlavni sekce       |
| H3      | 28px / 1.75rem  | Inter SemiBold (600)     | 1.3         | Podsekce, karty    |
| H4      | 20px / 1.25rem  | Inter Medium (500)       | 1.4         | Mensi nadpisy      |
| H5      | 18px / 1.125rem | Inter SemiBold (600)     | 1.5         | UI komponenty      |
| H6      | 16px / 1rem     | Inter SemiBold (600)     | 1.5         | Inline headings    |
| P       | 16px / 1rem     | Space Mono Regular (400) | 1.6         | Body text          |
| SMALL   | 14px / 0.875rem | Space Mono Regular (400) | 1.5         | Captions, metadata |
| A       | Inherit         | Space Mono Medium (500)  | Inherit     | Amber-800 #92400E  |

### Letter-spacing & Vertical Rhythm

| Element | Letter-spacing | Margin Bottom | Max Width    |
| ------- | -------------- | ------------- | ------------ |
| H1      | -0.02em        | 24px          | 24ch         |
| H2      | -0.015em       | 20px          | 32ch         |
| H3      | -0.01em        | 16px          | 40ch         |
| H4-H6   | 0em            | 12px          | 50ch         |
| P       | 0.01em         | 16px          | 65ch (prose) |
| Button  | 0.02em         | -             | auto         |
| Code    | 0em            | 16px          | 80ch         |

### Vertical Rhythm

- **Base:** 8px grid
- **Spacing:** 8px, 16px, 24px, 32px, 48px, 64px
- **Line-heights:** Always multiple of 4px
- **Margins:** Align to 8px grid

### Responsive Scaling

| Breakpoint        | H1-H3 Scale    | Body Text |
| ----------------- | -------------- | --------- |
| Desktop (1280px+) | 100%           | 16px      |
| Tablet (768px)    | 90%            | 16px      |
| Mobile (0-767px)  | 80% (min 24px) | 16px      |

### Line-length Rules

- **Prose (clanky):** max 65ch
- **UI komponenty:** max 50ch
- **Formulare:** max 40ch
- **Code bloky:** max 80ch

### Seznamy (Technical Style)

**Unordered list (Bullets):**

- Znak: `->` (sipka)
- Barva: Amber-500
- Font: Space Mono

**Ordered list (Steps):**

- Format: `[1]`, `[2]`, `[3]`...
- Barva: Amber-500
- Font: Space Mono

**Vnoreny seznam:**

- Level 1: `->` (sipka Amber-500)
- Level 2: `*` (tecka Neutral-500)

---

## 2. Barvy (Amber + Neutral)

Tepla amber v kombinaci s neutralni Neutral paletou. Zajistuje kontrastni a teply vzhled.

### 2A. Barevna Paleta

#### Primary - Amber-500

| Property     | Value                                                         |
| ------------ | ------------------------------------------------------------- |
| **HEX**      | #f59e0b                                                       |
| **RGB**      | 245, 158, 11                                                  |
| **Tailwind** | orange-500                                                    |
| **Pouziti**  | Pozadi primarnich tlacitek, ikony akci, call-to-action plochy |
| **Text**     | Musi byt cerny (#000)                                         |

**Varianty:**

- **Light:** Amber-50 (#fffbeb) - Sekundarni tlacitka, tagy/pills, upozorneni
- **Hover:** Amber-600 (#d97706) - Hover stav primarnich tlacitek

#### Text Links - Amber-800

| Property     | Value                                           |
| ------------ | ----------------------------------------------- |
| **HEX**      | #92400E                                         |
| **RGB**      | 146, 64, 14                                     |
| **Tailwind** | orange-800                                      |
| **Kontrast** | WCAG AA                                         |
| **Pouziti**  | Textove odkazy na bilem pozadi, zvyrazneny text |

#### Dark Background - Neutral-900

| Property        | Value                                                  |
| --------------- | ------------------------------------------------------ |
| **HEX**         | #171717                                                |
| **RGB**         | 23, 23, 23                                             |
| **Tailwind**    | neutral-900                                            |
| **Pouziti**     | Nadpisy, tmave pozadi sekci (hero, footer), code bloky |
| **Text na nem** | White (#FFFFFF)                                        |

### Neutral Palette pro Text

| Color       | HEX     | Tailwind    | Pouziti                          |
| ----------- | ------- | ----------- | -------------------------------- |
| Neutral-700 | #404040 | neutral-700 | Bezny text na svetlem pozadi     |
| Neutral-500 | #737373 | neutral-500 | Sekundarni text, popisky (small) |
| Neutral-300 | #D4D4D4 | neutral-300 | Sekundarni text na tmavem pozadi |

### Neutralni (White & Black)

| Color | HEX     | Pouziti                             |
| ----- | ------- | ----------------------------------- |
| White | #FFFFFF | Pozadi karet, text na tmavem pozadi |
| Black | #000000 | Text na Amber-500 (tlacitka, CTA)   |

### Semantic UI (Stavove barvy)

| State   | Text/Icon | Background | Border  |
| ------- | --------- | ---------- | ------- |
| Success | #047857   | #ECFDF5    | #A7F3D0 |
| Error   | #B91C1C   | #FEF2F2    | #FECACA |
| Warning | #B45309   | #FFFBEB    | #FDE68A |

### 2B. Barevne Kombinace Pozadi

| Typ           | Pozadi                | Bloky                 |
| ------------- | --------------------- | --------------------- |
| Svetle pozadi | Neutral-50 (#FAFAFA)  | Bila (#FFFFFF)        |
| Tmave pozadi  | Neutral-900 (#171717) | Neutral-900 (#171717) |

### 2C. Syntax Highlighting

5 barev z Tailwind 300 skaly pro zvyrazneni syntaxe kodu:

| Color       | HEX     | Pouziti                           |
| ----------- | ------- | --------------------------------- |
| Blue-300    | #93C5FD | Funkce, metody, procedury         |
| Emerald-300 | #6EE7B7 | Stringy, textove hodnoty          |
| Amber-300   | #FCD34D | Cisla, konstanty, boolean hodnoty |
| Purple-300  | #D8B4FE | Tridy, typy, specialni objekty    |

### 2D. Hranice (Borders)

**Na svetlem pozadi:**

- Base: Neutral-300
- Hover/Active: Neutral-500

**Na tmavem pozadi:**

- Base: Neutral-700
- Emphasis: 2px

**Tloustky hranic:**

- Default: 1px (karty, inputy, pagination)
- Emphasis: 2px (poznamky, zvyrazneni bloku)
- Focus: outline 3px + offset 2px (pristupnost, klavesnice)

---

## 3. Container & Spacing (Mobile First)

Web je mobile-first s responzivnimi container sirkami. Grid layout je volitelny pro specificke pripady.

### 3A. Responsive Breakpoints

| Breakpoint         | Media Query       | Container              | Padding | Typography              |
| ------------------ | ----------------- | ---------------------- | ------- | ----------------------- |
| Mobile (Default)   | 0px - 767px       | 100% (fluid)           | 16px    | 80% skalovani nadpisu   |
| Tablet             | min-width: 768px  | 720px                  | 24px    | 90% skalovani nadpisu   |
| Desktop Small      | min-width: 1024px | 960px                  | 32px    | 100% plna velikost      |
| Desktop (Primarni) | min-width: 1280px | 1280px                 | 40px    | 100% optimalni velikost |
| Wide Desktop       | min-width: 1536px | 1280px (max, centered) | 48px+   | 100%                    |

```css
/* Breakpoints v CSS */
@media (min-width: 768px) {
  /* Tablet */
}
@media (min-width: 1024px) {
  /* Desktop Small */
}
@media (min-width: 1280px) {
  /* Desktop */
}
@media (min-width: 1536px) {
  /* Wide */
}
```

### Container System

| Typ                | Sirka  | CSS                 | Pouziti                             |
| ------------------ | ------ | ------------------- | ----------------------------------- |
| Standard Container | 1280px | `max-width: 1280px` | Homepage, portfolio, kontakt        |
| Prose (Obsah)      | 65ch   | `max-width: 65ch`   | Blog clanky, prednasky, dokumentace |

### Grid Layout (Volitelny)

12-sloupcovy grid pro specificke layouty uvnitr containeru.

- **Sloupcu:** 12
- **Gap:** 32px

**Layouty:**

- 2-8-2: Standardni tri sloupce (sidebar - obsah - sidebar)
- 8-4: Obsah + Sidebar
- 9-3: Siroky obsah + Uzky sidebar
- 4-4-4: Tri stejne sloupce
- 6-6: Dva stejne sloupce

### Hero Sekce (Obsah)

Struktura pro clanky a obsah:

1. Tmave hero pozadi (Neutral-900)
2. Titulek (H1)
3. Tagy + Datum vydani
4. Obsah v prose rezimu

---

## 4. Hierarchie Tvaru (Sharp Design)

**Ostre hrany vsude. Zadna zaobleni.**

Technicky, modernejsi look inspirovany PlanetScale a OpenStatus.

| Element  | Border Radius |
| -------- | ------------- |
| Tlacitka | 0px           |
| Inputy   | 0px           |
| Karty    | 0px           |
| Modaly   | 0px           |
| Vse      | 0px (Sharp)   |

---

## 5. Animace

### Fade In Up

Prvek se plynule zobrazi zespodu nahoru pri nacteni nebo scrollu.

| Parametr | Hodnota             |
| -------- | ------------------- |
| Trvani   | 0.6s / 1.2s (slow)  |
| Easing   | ease-out            |
| Posun    | 30px zespodu nahoru |

### Typewriter Text

Efekt psani textu s blikajicim kurzorem. Vhodne pro zvyrazneni sloganu nebo statusu.

| Parametr | Hodnota           |
| -------- | ----------------- |
| Trvani   | 3s (nastavitelne) |
| Kroky    | steps(37, end)    |
| Kurzor   | blink 0.8s        |

### Hover Highlight

Zvyrazneni bloku pri najeti mysi - tenky oranzovy ramecek.

| Parametr      | Hodnota             |
| ------------- | ------------------- |
| Barva ramecku | Amber-500 (#f59e0b) |
| Sirka ramecku | 1px                 |
| Transition    | 0.3s ease           |

---

## 6. Navigace & Menu

### Hlavni Navigacni Bar (Desktop)

| Vlastnost     | Hodnota     |
| ------------- | ----------- |
| Vyska         | 56px        |
| Padding X     | 24px        |
| Pozadi        | Neutral-900 |
| Spodni border | Neutral-900 |

**Stavy odkazu:**

- Normal: White text
- Hover: underline Amber-500
- Active: spodni border 2px Amber-500
- Focus: 2px outline Amber-300

### Mobilni Navigace (2 radky, bez hamburgeru)

| Vlastnost        | Hodnota     |
| ---------------- | ----------- |
| Vyska prvni rady | 48px        |
| Padding X        | 16px        |
| Pozadi           | Neutral-900 |

**Struktura:**

- Prvni radek: Logo + CTA tlacitko
- Druhy radek: Vsechny odkazy (horizontalne scrolluji)

**Poznamka:** Bez hamburgeru; presne dva radky.

### Pravidla & Pristupnost

- Kontrast odkazu min 4.5:1
- Aktivni odkaz ma spodni Amber border 2px
- Dropdowny v hlavni navigaci nepouzivat
- Focus viditelny: 2px outline Amber-300
- Navigace ovladatelna klavesnici (Tab, Enter, Esc)
- Sticky header volitelny: `position: sticky; top: 0;` + shadow pri scrollu

**Breakpointy vysky:**

- Desktop: 56px
- Tablet: 52px
- Mobile: 48px

---

## 7. Komponenty

### Kontextualni Bloky

| Typ              | Pozadi           | Text              | Tlacitka              |
| ---------------- | ---------------- | ----------------- | --------------------- |
| Standardni sekce | Neutral-50/White | Neutral-700       | Primarni + Sekundarni |
| Tmava sekce      | Neutral-900      | White/Neutral-300 | Primarni + Sekundarni |

### Article Cards

Struktura pro seznam clanku s nahledem:

1. **Nahledovy obrazek:** 1200x630px (pomer 1.91:1), vyska 200px
2. **Metadata:** Hashtagy vlevo + Datum vpravo
3. **Titulek:** H3 (1.25rem), maximalne 2 radky
4. **Excerpt:** 0.9rem, 2-3 radky popisu
5. **Odkaz:** "Cist dale" s ikonou sipky
6. **Hover:** Zmena border-color na Amber-500

**Vizualni alternativy bez fotografii:**

- Gradient Neutral-900 -> Neutral-700 + velka ikona (Phosphor) s opacity
- Tmave pozadi + snippet kodu se syntax highlighting
- Grid pattern pozadi + Amber ctverec s ikonou uprostred

### Breadcrumbs

| Vlastnost        | Hodnota                                                    |
| ---------------- | ---------------------------------------------------------- |
| Struktura        | `<nav aria-label="Breadcrumb"><ol>...</ol></nav>`          |
| Oddelovac        | znak `>` (ne jako odkaz)                                   |
| Aktualni stranka | `aria-current="page"`, bez podtrzeni                       |
| Responzivne      | na <= 480px se prostredni polozky skryji, zobrazi se `...` |

**Poznamka:** Breadcrumbs nikdy nepouzivaji dropdowny.

### Pagination

| Vlastnost       | Hodnota                                         |
| --------------- | ----------------------------------------------- |
| Struktura       | `<nav aria-label="Pagination">`                 |
| Aktivni stranka | `aria-current="page"` + kontrastni pozadi Amber |
| Disabled        | `aria-disabled="true"` (bez interakce)          |
| Focus           | outline v Amber                                 |

**Doporuceni:** Max 7 viditelnych polozek, delsi sekvence zkratit (...).

### Notifications & Toasts

| Vlastnost         | Hodnota                      |
| ----------------- | ---------------------------- |
| Kontejner         | `aria-live="polite"`         |
| Toast             | `role="status"`              |
| Zaviraci tlacitko | fokusovatelne s `aria-label` |

---

## 8. Stavy & Loading

### Skeleton Loading

Animovany placeholder behem nacitani obsahu.

### Validace Formulare

Chybove stavy s Error barvou (#B91C1C) a pomocnym textem.

---

## 9. Do's & Don'ts

### DO

- Vysoky kontrast na amber (cerny text)
- Sharp edges (0px radius)
- Konzistentni spacing (8px grid)
- Pristupnost (focus stavy, aria atributy)

### DON'T

- Nizky kontrast (bily text na amber)
- Zaoblene rohy
- Nekonzistentni mezery
- Chybejici focus stavy

---

## Quick Reference

### Tailwind Classes

```
/* Barvy */
bg-orange-500        /* Primary CTA */
bg-orange-50         /* Secondary CTA */
bg-neutral-900         /* Dark sections */
bg-neutral-50          /* Light background */
bg-white            /* Cards */
text-neutral-900       /* Headings */
text-neutral-700       /* Body text */
text-neutral-500       /* Muted text */
text-orange-800      /* Links */
border-neutral-300     /* Light borders */
border-neutral-700     /* Dark borders */

/* Typography */
font-sans           /* Inter (headings) */
font-mono           /* Space Mono (body) */

/* Sharp design */
rounded-none        /* Vse bez zaobleni */
```

### CSS Variables

```css
:root {
  /* Colors */
  --color-primary: #f59e0b; /* Amber-500 */
  --color-primary-hover: #d97706; /* Amber-600 */
  --color-text-link: #92400e; /* Amber-800 */
  --color-dark: #171717; /* Neutral-900 */
  --color-light: #fafafa; /* Neutral-50 */

  /* Typography */
  --font-display: "Inter", sans-serif;
  --font-body: "Space Mono", monospace;

  /* Spacing */
  --grid-base: 8px;
  --container-max: 1280px;
  --prose-max: 65ch;

  /* Border */
  --border-radius: 0px;
}
```
