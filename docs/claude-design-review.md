# Design and UI Component Analysis

**Date**: 2025-12-07
**Reviewer**: Claude (Automated Analysis)
**Scope**: UI components and design system consistency

## Executive Summary

This analysis identified several critical inconsistencies in the UI component architecture and design system. The main issues include duplicate components (Astro vs React), hardcoded Tailwind classes bypassing the component system, inconsistent naming conventions, and lack of centralized design tokens.

**Key Metrics**:

- 6 UI components in `src/components/ui/`
- 3 duplicate component implementations found
- 48+ instances of hardcoded text color classes
- Mixed naming conventions (PascalCase vs kebab-case)

---

## Critical Inconsistencies Found

### 1. Duplicate Components (Astro vs React)

**Severity: High**
**Location**: `src/components/homepage/`

Duplicate implementations exist in both Astro and React formats:

| Component    | Astro Version        | React Version        | Issue             |
| ------------ | -------------------- | -------------------- | ----------------- |
| CallToAction | `CallToAction.astro` | `call-to-action.tsx` | Identical content |
| Cooperation  | `Cooperation.astro`  | `cooperation.tsx`    | Identical content |
| Navigation   | `Navigation.astro`   | `navigation.tsx`     | Wrapper pattern   |

**Impact**:

- Maintenance overhead - changes must be made in two places
- Potential drift between versions over time
- Confusion about which version to use
- Increased bundle size

**Evidence**:

```typescript
// src/components/homepage/CallToAction.astro (lines 7-23)
<CTA id="pojdme-do-toho">
  <div class="mx-auto max-w-xl text-center">
    <Heading level="h2" text="black"> Pojďme do toho společně </Heading>
    // ... identical to .tsx version
  </div>
</CTA>

// src/components/homepage/call-to-action.tsx (lines 7-26)
<CTA id="pojdme-do-toho">
  <div className="mx-auto max-w-xl text-center">
    <Heading level="h2" text="black">
      Pojďme do toho společně
    </Heading>
    // ... identical to .astro version
  </div>
</CTA>
```

---

### 2. Inconsistent Naming Conventions

**Severity: Medium**
**Location**: Throughout `src/components/`

File naming mixes PascalCase and kebab-case without clear rules:

**UI Components** (kebab-case):

- `button.tsx`
- `card.tsx`
- `container.tsx`
- `heading.tsx`
- `section.tsx`
- `text.tsx`

**Homepage Components** (mixed):

- `Hero.astro` (PascalCase)
- `Clients.astro` (PascalCase)
- `References.astro` (PascalCase)
- `CallToAction.astro` (PascalCase)
- `call-to-action.tsx` (kebab-case)
- `cooperation.tsx` (kebab-case)
- `services.tsx` (kebab-case)
- `training.tsx` (kebab-case)

**Impact**:

- Harder to locate files
- Import confusion
- No clear convention to follow
- Inconsistent developer experience

---

### 3. Hardcoded Tailwind Classes Throughout Components

**Severity: High**
**Location**: Multiple components bypass the UI component system

Instead of using standardized UI components, many places use inline Tailwind classes:

**Hero Component** (`src/components/homepage/Hero.astro:16-32`):

```html
<h1 class="font-display text-4xl font-black tracking-tight text-zinc-900 sm:text-7xl">
  <!-- Should use <Heading> component instead -->
</h1>
```

**Navigation Component** (`src/components/navigation.tsx:24`):

```typescript
const classes =
  "inline-block rounded-full bg-zinc-100 px-4 py-2 text-lg font-bold text-zinc-900 focus-visible:outline-black";
// Custom button styles instead of using <Button> component
```

**Footer Component** (`src/components/Footer.astro:40`):

```html
<h3 class="text-lg font-medium">Vojtěch Mareš</h3>
<!-- Should use <Heading> component -->
```

**References Component** (`src/components/homepage/References.astro`):

```html
<p class="mt-4 text-lg tracking-tight text-zinc-700">
  <!-- Line 68, 89: hardcoded text styles -->
</p>
<div class="font-display text-base text-zinc-900">
  <!-- Line 99: hardcoded text styles -->
</div>
```

**Cooperation Component** (`src/components/homepage/Cooperation.astro:68,71`):

```html
<span class="text-2xl font-normal text-white">
  <!-- Should use typography component -->
</span>
```

**Impact**:

- Component system rendered ineffective
- Difficult to maintain consistent design
- Changes require finding all hardcoded instances
- No single source of truth for styles

---

### 4. Inconsistent Color Palette Usage

**Severity: Medium**
**Location**: Throughout the codebase

Color usage lacks standardization and semantic meaning:

**Component Color Props**:

- `Heading`: `text="black" | "white" | "amber"`
- `Text`: `text="black" | "white" | "zinc"`
- `Button`: `color="black" | "white" | "amber"`
- `Section`: `background="white" | "black" | "amber" | "zinc"`
- `Card`: `background="white" | "black" | "amber" | "zinc" | "amber-light"`

**Hardcoded Colors** (48+ instances found):

- `text-zinc-900` (primary text)
- `text-zinc-700` (body text)
- `text-zinc-300` (muted text)
- `text-amber-500` (accent)
- `bg-zinc-100` (light background)
- `bg-zinc-100` (card background)

**Problems**:

- No semantic color names (e.g., `text-primary`, `text-muted`)
- Same color represented multiple ways (`"black"` vs `text-zinc-900`)
- Inconsistent muted text (sometimes `zinc-300`, sometimes `zinc-700`)
- Body text uses both `zinc-700` and `zinc-900`

**Example**:

```typescript
// Text component (src/components/ui/text.tsx:10-14)
const textStyles = {
  black: "text-zinc-900",
  white: "text-white",
  zinc: "text-zinc-300",  // But what about zinc-700, zinc-500?
};

// Hardcoded in Hero.astro:33
<p class="mt-6 max-w-2xl text-lg text-zinc-700">
  // Different zinc variant, not using Text component
</p>
```

---

### 5. Spacing Inconsistencies

**Severity: Medium**
**Location**: Layout components and sections

No consistent spacing scale is applied:

| Component | Padding                     | Pattern               |
| --------- | --------------------------- | --------------------- |
| Hero      | `pt-5 pb-8 md:py-0 lg:pt-8` | Custom per breakpoint |
| Section   | `py-20 sm:py-32`            | Component default     |
| Footer    | `py-8`, `py-4`              | Multiple values       |
| Card      | `px-4 py-8 sm:px-8`         | Component default     |
| Container | `px-4`, `lg:px-8`           | Component default     |

**Problems**:

- No standardized spacing tokens
- Section padding varies widely
- Hard to maintain consistent visual rhythm
- No clear spacing scale (8px grid? 4px grid?)

**Example**:

```html
<!-- Hero.astro:10 -->
<Container className="pt-5 pb-8 md:py-0 lg:pt-8">
  <!-- vs Section component base styles (section.tsx:12) -->
  const baseStyles = "py-20 sm:py-32";

  <!-- vs Footer.astro:36 -->
  <Container className="py-8"></Container>
</Container>
```

---

### 6. Typography System Incomplete

**Severity: Medium**
**Location**: `src/components/ui/`

**Heading Component Issues** (`src/components/ui/heading.tsx:35-37`):

```typescript
if (level === "h4" || level === "h5" || level === "h6") {
  throw new Error("Headings must be level 1, 2, or 3");
}
```

- Artificially limits heading levels
- No h4-h6 support (valid HTML elements)
- Error thrown at runtime instead of TypeScript compile time

**Text Component Not Used**:

- `Text` component exists (`src/components/ui/text.tsx`) but has zero usage
- Body text scattered with classes: `text-lg`, `text-base`, `text-sm`
- No consistent paragraph/body text component

**Typography Classes Everywhere**:

```html
<!-- Hardcoded throughout -->
<p class="mt-4 text-lg tracking-tight text-zinc-700"></p>
<p class="mt-6 max-w-2xl text-lg text-zinc-700"></p>
<p class="text-lg text-zinc-300">
  <span class="text-2xl font-normal text-white"></span>
</p>
```

**Missing Components**:

- No "body text" variants (large, base, small)
- No "label" component
- No "caption" component
- No "code" inline component

---

### 7. Props Interface Inconsistencies

**Severity: Low**
**Location**: UI components

Inconsistent prop naming and type definitions:

**Type Definition Style**:

```typescript
// Some use named types
type HeadingProps = { ... }  // heading.tsx:4

type TextProps = { ... }     // text.tsx:4

type CardProps = { ... }     // card.tsx:4

// Others use inline
type Props = { ... }         // container.tsx:4, button.tsx:36
```

**Color Prop Naming**:

```typescript
// Heading & Text use "text"
text?: "black" | "white" | "amber"

// Button uses "color"
color?: "black" | "white" | "amber"

// Section & Card use "background"
background?: "white" | "black" | "amber" | "zinc"
```

**Impact**:

- Harder to learn API (inconsistent prop names)
- Color selection prop should be standardized (prefer `variant`)
- Type naming should be consistent (prefer component-specific like `HeadingProps`)

---

### 8. Missing Component Patterns

**Severity: Medium**
**Location**: `src/components/ui/`

Core UI components that should exist but don't:

**Missing Components**:

1. **Link Component** - Standardized link/anchor with variants
   - Currently using raw `<a>` tags everywhere
   - No hover states standardized
   - No underline variants

2. **Badge/Chip Component** - For navigation pills, tags
   - Navigation uses custom `LinkItem` implementation
   - Should be reusable across site

3. **Icon Component** - SVG wrapper with sizing
   - Social icons in footer are raw SVG
   - No standardization for icon sizing

4. **Grid Component** - Grid layout helper
   - Currently using inline `grid grid-cols-*` everywhere

5. **Stack Component** - Vertical/horizontal spacing
   - Currently using `flex flex-col gap-y-*` everywhere

6. **Body Text Component** - Paragraph text variants
   - Need: `<Body variant="large" | "base" | "small" | "muted">`

**Evidence**:

```typescript
// Navigation custom button (should be Badge component)
function LinkItem({ href, name, className = "" }: {
  href: string;
  name: string;
  className?: string;
}) {
  const classes = "inline-block rounded-full bg-zinc-100 px-4 py-2 text-lg font-bold text-zinc-900 focus-visible:outline-black";
  return (
    <a href={href} className={clsx(className, classes)}>
      {name}
    </a>
  );
}

// Footer social icons (should use Icon component)
<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
     class="h-6 w-6 fill-black group-hover:fill-zinc-700">
  <title>Bluesky</title>
  <path d="M12 10.8c-1.087-2.114..."></path>
</svg>
```

---

## Proposed Standardization Plan

### Phase 1: Foundation & Component Library (Priority: Critical)

#### 1.1 Establish Design Tokens

Create `src/lib/design-tokens.ts` with centralized tokens:

```typescript
// Color Palette - Semantic naming
export const colors = {
  // Backgrounds
  background: {
    primary: "bg-amber-500",
    secondary: "bg-zinc-900",
    muted: "bg-zinc-100",
    surface: "bg-white",
  },
  // Text
  text: {
    primary: "text-zinc-900",
    secondary: "text-zinc-700",
    muted: "text-zinc-500",
    inverse: "text-white",
    accent: "text-amber-500",
  },
  // Borders
  border: {
    default: "border-zinc-200",
    muted: "border-zinc-100",
  },
};

// Typography Scale
export const typography = {
  heading: {
    h1: "text-4xl sm:text-5xl font-bold",
    h2: "text-3xl sm:text-4xl font-bold",
    h3: "text-2xl sm:text-3xl font-medium",
    h4: "text-xl sm:text-2xl font-medium",
    h5: "text-lg sm:text-xl font-medium",
    h6: "text-base sm:text-lg font-medium",
  },
  body: {
    large: "text-lg",
    base: "text-base",
    small: "text-sm",
    tiny: "text-xs",
  },
};

// Spacing Scale
export const spacing = {
  section: "py-20 sm:py-32",
  card: "px-4 py-8 sm:px-8",
  container: "px-4 lg:px-8",
};

// Border Radius
export const radius = {
  none: "rounded-none",
  normal: "rounded-3xl",
  full: "rounded-full",
};
```

#### 1.2 Standardize File Naming

**Decision**: Use **kebab-case** for all component files

Rationale:

- Aligns with existing `src/components/ui/` convention
- Web-friendly (URLs, imports)
- No case-sensitivity issues across file systems

**Files to Rename**:

```
src/components/homepage/Hero.astro → hero.astro
src/components/homepage/Clients.astro → clients.astro
src/components/homepage/References.astro → references.astro
src/components/homepage/CallToAction.astro → call-to-action.astro (then delete)
src/components/homepage/Cooperation.astro → cooperation.astro (then delete)
src/components/Navigation.astro → navigation.astro
src/components/Footer.astro → footer.astro
```

#### 1.3 Remove Duplicate Components

**Strategy**: Keep React versions (`.tsx`), remove Astro duplicates

**Components to Delete**:

1. `src/components/homepage/CallToAction.astro`
   - Keep: `call-to-action.tsx`
   - Reason: Identical content, no Image usage

2. `src/components/homepage/Cooperation.astro`
   - Keep: `cooperation.tsx`
   - Reason: Identical content, no Image usage

**Components to Keep Both**:

1. `src/components/Navigation.astro` + `navigation.tsx`
   - Astro: Wrapper that fetches pages data
   - React: Renders navigation UI
   - Pattern: Data fetching in Astro, rendering in React

#### 1.4 Fix UI Component Prop Naming

Standardize color/variant prop naming across all components:

**Current State**:

```typescript
// Heading & Text
<Heading text="black" />
<Text text="white" />

// Button
<Button color="amber" />

// Section & Card
<Section background="zinc" />
<Card background="white" />
```

**Proposed Standard**:

```typescript
// All components use "variant" for color/style variations
<Heading variant="primary" />
<Text variant="muted" />
<Button variant="primary" />
<Section variant="dark" />
<Card variant="elevated" />
```

**Migration Map**:

```typescript
// Old → New
text="black" → variant="primary"
text="white" → variant="inverse"
text="amber" → variant="accent"
color="black" → variant="primary"
background="zinc" → variant="muted"
background="black" → variant="dark"
```

---

### Phase 2: Component Standardization (Priority: High)

#### 2.1 Extend Typography Components

**Update Heading Component** (`src/components/ui/heading.tsx`):

```typescript
// Remove error, add h4-h6 support
const levelStyles = {
  h1: "text-4xl sm:text-5xl font-bold",
  h2: "text-3xl sm:text-4xl font-bold",
  h3: "text-2xl sm:text-3xl font-medium",
  h4: "text-xl sm:text-2xl font-medium", // Add
  h5: "text-lg sm:text-xl font-medium", // Add
  h6: "text-base sm:text-lg font-medium", // Add
};
```

**Create Body Text Component** (`src/components/ui/body.tsx`):

```typescript
import clsx from "clsx";
import { type ReactNode } from "react";

type BodyProps = {
  children?: ReactNode;
  className?: string;
  variant?: "large" | "base" | "small" | "muted";
  as?: "p" | "span" | "div";
};

const variantStyles = {
  large: "text-lg text-zinc-900",
  base: "text-base text-zinc-900",
  small: "text-sm text-zinc-700",
  muted: "text-base text-zinc-500",
};

export function Body({
  children,
  className,
  variant = "base",
  as: Tag = "p"
}: BodyProps) {
  return (
    <Tag className={clsx(variantStyles[variant], className)}>
      {children}
    </Tag>
  );
}
```

#### 2.2 Create Missing Core Components

**Link Component** (`src/components/ui/link.tsx`):

```typescript
import clsx from "clsx";
import { type ReactNode } from "react";

type LinkProps = {
  href: string;
  children: ReactNode;
  variant?: "default" | "underline" | "button";
  external?: boolean;
  className?: string;
};

const variantStyles = {
  default: "text-zinc-900 hover:text-amber-500 transition",
  underline: "text-zinc-900 underline hover:text-amber-500",
  button: "inline-block rounded-full bg-zinc-100 px-4 py-2 text-lg font-bold text-zinc-900 hover:bg-zinc-200",
};

export function Link({
  href,
  children,
  variant = "default",
  external = false,
  className
}: LinkProps) {
  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <a
      href={href}
      className={clsx(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </a>
  );
}
```

**Badge Component** (`src/components/ui/badge.tsx`):

```typescript
import clsx from "clsx";
import { type ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "accent";
  className?: string;
};

const variantStyles = {
  default: "inline-block rounded-full bg-zinc-100 px-4 py-2 text-base font-bold text-zinc-900",
  accent: "inline-block rounded-full bg-amber-500 px-4 py-2 text-base font-bold text-white",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={clsx(variantStyles[variant], className)}>
      {children}
    </span>
  );
}
```

**Icon Component** (`src/components/ui/icon.tsx`):

```typescript
import clsx from "clsx";
import { type ReactNode } from "react";

type IconProps = {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeStyles = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Icon({ children, size = "md", className }: IconProps) {
  return (
    <span className={clsx(sizeStyles[size], className)}>
      {children}
    </span>
  );
}
```

**Stack Component** (`src/components/ui/stack.tsx`):

```typescript
import clsx from "clsx";
import { type ReactNode } from "react";

type StackProps = {
  children: ReactNode;
  direction?: "vertical" | "horizontal";
  gap?: "sm" | "md" | "lg";
  className?: string;
};

const baseStyles = {
  vertical: "flex flex-col",
  horizontal: "flex flex-row",
};

const gapStyles = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-8",
};

export function Stack({
  children,
  direction = "vertical",
  gap = "md",
  className
}: StackProps) {
  return (
    <div className={clsx(baseStyles[direction], gapStyles[gap], className)}>
      {children}
    </div>
  );
}
```

#### 2.3 Refactor Existing Components

**Navigation** (`src/components/navigation.tsx`):

```typescript
// Replace custom LinkItem with Badge
import { Badge } from "./ui/badge";

function NavLink({ href, name }: { href: string; name: string }) {
  return (
    <a href={href}>
      <Badge variant="default">{name}</Badge>
    </a>
  );
}

// In render:
{links.map((link) => (
  <NavLink key={link.name} href={link.href} name={link.name} />
))}
```

**Hero** (`src/components/homepage/hero.astro`):

```astro
<!-- Replace hardcoded h1 with Heading component -->
<Heading level="h1">
  Jsem{" "}
  <span class="relative whitespace-nowrap text-amber-500">
    <!-- SVG underline -->
    <span class="relative">Vojtěch Mareš</span>
  </span>
  , DevOps architekt.
</Heading>

<!-- Replace hardcoded p with Body component -->
<Body variant="large" className="mt-6 max-w-2xl">
  Společně snížíme vaše náklady na infrastrukturu...
</Body>
```

**Footer** (`src/components/footer.astro`):

```astro
<!-- Replace hardcoded h3 with Heading -->
<Heading level="h3">Vojtěch Mareš</Heading>

<!-- Replace hardcoded links with Link component -->
<Link href="tel:+420732490651" variant="underline"> +420 732 490 651 </Link>
```

---

### Phase 3: Image Handling Pattern (Priority: Medium)

#### 3.1 Establish Clear Pattern

**Rule**: Only use Astro components when `<Image>` from `astro:assets` is needed.

**Pattern**: Create minimal Astro wrappers that only handle images, delegate to React for logic.

**Example Structure**:

```
src/components/homepage/
  ├── hero.tsx                 # Main component (React)
  └── hero-with-image.astro    # Wrapper for image optimization
```

**Implementation**:

```typescript
// src/components/homepage/hero.tsx (React - main logic)
import { Heading } from "../ui/heading";
import { Body } from "../ui/body";
import { Button } from "../ui/button";
import { Container } from "../ui/container";

type HeroProps = {
  avatarSlot?: React.ReactNode;  // Slot for Astro Image
};

export function Hero({ avatarSlot }: HeroProps) {
  return (
    <Container className="pt-5 pb-8 md:py-0 lg:pt-8">
      <div className="flex flex-col justify-center md:flex-row md:items-end md:justify-between">
        <div className="md:my-auto">
          <Heading level="h1">
            Jsem <span className="...">Vojtěch Mareš</span>, DevOps architekt.
          </Heading>
          <Body variant="large" className="mt-6 max-w-2xl">
            Společně snížíme vaše náklady...
          </Body>
          <div className="mt-10 flex gap-x-6">
            <Button href="..." size="large">Domluvme si schůzku</Button>
          </div>
        </div>
        {avatarSlot}
      </div>
    </Container>
  );
}
```

```astro
---
// src/components/homepage/hero-with-image.astro (Astro wrapper - only images)
import { Image } from "astro:assets";
import { Hero } from "./hero";
import avatarVojtechMares from "../../images/people/vojtech-mares.png";
---

<Hero>
  <Image
    slot="avatarSlot"
    class="mx-auto hidden max-w-[400px] pt-10 md:mx-0 md:block md:pt-0"
    priority
    loading="eager"
    layout={"full-width"}
    src={avatarVojtechMares}
    alt="Vojtěch Mareš"
    widths={[400, 600, 800]}
    sizes={`(max-width: 768px) 400px, (max-width: 1024px) 600px, 800px`}
  />
</Hero>
```

**When to Use Each**:

- **React Component**: All logic, state, interactivity, most rendering
- **Astro Wrapper**: Only when you need `<Image>` from `astro:assets`
- **Import Pattern**: Pages import Astro wrapper; Astro wrapper imports React component

---

### Phase 4: Color & Spacing System (Priority: Medium)

#### 4.1 Define Semantic Color System

**Color Token Mapping**:

```typescript
// Semantic → Tailwind
export const colorTokens = {
  // Backgrounds
  "bg-primary": "bg-amber-500",
  "bg-secondary": "bg-zinc-900",
  "bg-muted": "bg-zinc-100",
  "bg-surface": "bg-white",

  // Text
  "text-primary": "text-zinc-900",
  "text-secondary": "text-zinc-700",
  "text-muted": "text-zinc-500",
  "text-inverse": "text-white",
  "text-accent": "text-amber-500",

  // Borders
  "border-default": "border-zinc-200",
  "border-muted": "border-zinc-100",
};
```

**Component Variant Mapping**:

```typescript
// Heading component variants
variant="primary"   → text-zinc-900
variant="inverse"   → text-white
variant="accent"    → text-amber-500

// Section component variants
variant="default"   → bg-zinc-100
variant="surface"   → bg-white
variant="dark"      → bg-zinc-900
variant="accent"    → bg-amber-500

// Button component variants
variant="primary"   → bg-zinc-900 text-white
variant="secondary" → bg-white text-zinc-900
variant="accent"    → bg-amber-500 text-white
```

#### 4.2 Spacing Scale

**Define Spacing Tokens**:

```typescript
export const spacing = {
  // Sections
  section: {
    sm: "py-12 sm:py-16",
    md: "py-20 sm:py-32", // Default
    lg: "py-32 sm:py-40",
  },

  // Cards
  card: {
    sm: "px-4 py-4 sm:px-6 sm:py-6",
    md: "px-4 py-8 sm:px-8", // Default
    lg: "px-8 py-12 sm:px-12",
  },

  // Container
  container: {
    x: "px-4 lg:px-8",
    y: "py-4 lg:py-8",
  },

  // Stack gaps
  gap: {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4", // Default
    lg: "gap-6",
    xl: "gap-8",
  },
};
```

**Update Components**:

```typescript
// Section component
export function Section({
  size = "md",  // Add size prop
  ...props
}) {
  const sizeStyles = {
    sm: "py-12 sm:py-16",
    md: "py-20 sm:py-32",
    lg: "py-32 sm:py-40",
  };

  return (
    <section className={clsx(sizeStyles[size], ...)}>
      {children}
    </section>
  );
}
```

---

### Phase 5: Refactoring Implementation (Priority: High)

#### 5.1 Migration Order

**Step 1: Foundation** (Est. 1-2 hours)

1. Create `src/lib/design-tokens.ts`
2. Create `src/types/components.ts` for shared types
3. Standardize file naming (rename all PascalCase → kebab-case)
4. Delete duplicate components (`CallToAction.astro`, `Cooperation.astro`)

**Step 2: UI Components** (Est. 2-3 hours) 5. Update existing UI components with standardized props:

- `heading.tsx`: Add h4-h6, rename `text` → `variant`
- `text.tsx`: Rename `text` → `variant`
- `button.tsx`: Rename `color` → `variant`
- `section.tsx`: Rename `background` → `variant`, add `size`
- `card.tsx`: Rename `background` → `variant`

6. Create missing UI components:
   - `body.tsx`
   - `link.tsx`
   - `badge.tsx`
   - `icon.tsx`
   - `stack.tsx`

**Step 3: Refactor Components** (Est. 3-4 hours) 7. Update `navigation.tsx`:

- Replace custom `LinkItem` with `Badge` component
- Update button instances to use `Button` component

8. Refactor `hero.astro`:
   - Split into `hero.tsx` (React) + `hero-with-image.astro` (wrapper)
   - Replace hardcoded `h1` with `Heading`
   - Replace hardcoded `p` with `Body`

9. Refactor `footer.astro`:
   - Replace hardcoded `h3` with `Heading`
   - Replace hardcoded links with `Link` component
   - Wrap social icons in `Icon` component

**Step 4: Homepage Sections** (Est. 2-3 hours) 10. Update `services.tsx` 11. Update `training.tsx` 12. Update `cooperation.tsx` 13. Update `references.astro` → convert to `.tsx` if no images, or refactor

**Step 5: Page Templates** (Est. 1-2 hours) 14. Update blog pages 15. Update training pages 16. Update dynamic page templates

**Step 6: Testing & Cleanup** (Est. 1 hour) 17. Visual regression testing 18. Remove unused imports 19. Update documentation

**Total Estimated Time**: 10-15 hours

#### 5.2 Type Safety

**Create Shared Types** (`src/types/components.ts`):

```typescript
// Color variants
export type ColorVariant = "primary" | "secondary" | "accent" | "muted" | "inverse";

// Size variants
export type SizeVariant = "sm" | "md" | "lg";

// Component props
export type BaseComponentProps = {
  className?: string;
  children?: React.ReactNode;
};

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadingProps = BaseComponentProps & {
  level?: HeadingLevel;
  variant?: ColorVariant;
  id?: string;
  ariaLabel?: string;
};

export type ButtonProps = BaseComponentProps & {
  variant?: "solid" | "outline";
  color?: ColorVariant;
  size?: SizeVariant;
  href?: string;
  type?: "text/html" | "application/rss+xml" | "application/atom+xml";
};

// ... more component types
```

**Update Components to Use Shared Types**:

```typescript
// src/components/ui/heading.tsx
import { HeadingProps } from "../../types/components";

export function Heading({ children, className, level = "h1", variant = "primary", id, ariaLabel }: HeadingProps) {
  // ...
}
```

---

### Phase 6: Documentation (Priority: Low)

#### 6.1 Component Documentation

**Create Component Library README** (`src/components/ui/README.md`):

````markdown
# UI Component Library

## Design Principles

1. **Consistency**: Use components instead of hardcoding Tailwind classes
2. **Semantic**: Use variant names that describe purpose, not appearance
3. **Composable**: Components should work together seamlessly
4. **TypeScript**: All components are fully typed

## When to Use Astro vs React

### Use React Components (`.tsx`)

- All interactive components
- Components with logic and state
- Most UI rendering
- **Default choice**

### Use Astro Components (`.astro`)

- Only when you need `<Image>` from `astro:assets`
- Create minimal wrapper that delegates to React component
- Data fetching wrappers (like `Navigation.astro`)

### Example Pattern

```typescript
// hero.tsx (React - main component)
export function Hero({ avatarSlot }: { avatarSlot?: ReactNode }) {
  return <div>{/* content */}{avatarSlot}</div>
}

// hero-with-image.astro (Astro - image wrapper)
---
import { Image } from "astro:assets";
import { Hero } from "./hero";
---
<Hero>
  <Image slot="avatarSlot" src={...} />
</Hero>
```
````

## Components

### Typography

#### Heading

```tsx
<Heading level="h1" variant="primary">
  Main Heading
</Heading>
```

Props:

- `level`: h1-h6 (default: h1)
- `variant`: primary | inverse | accent (default: primary)

#### Body

```tsx
<Body variant="large">Body text content</Body>
```

Props:

- `variant`: large | base | small | muted (default: base)
- `as`: p | span | div (default: p)

### Buttons & Links

#### Button

```tsx
<Button variant="solid" color="primary" size="large">
  Click Me
</Button>
```

Props:

- `variant`: solid | outline (default: solid)
- `color`: primary | secondary | accent (default: primary)
- `size`: sm | md | lg (default: md)
- `href`: Optional link URL

#### Link

```tsx
<Link href="/page" variant="underline">
  Read more
</Link>
```

Props:

- `variant`: default | underline | button (default: default)
- `external`: boolean (adds target="\_blank")

### Layout

#### Container

```tsx
<Container className="py-8">{children}</Container>
```

Max-width container with responsive padding.

#### Section

```tsx
<Section variant="dark" size="md">
  {children}
</Section>
```

Props:

- `variant`: default | surface | dark | accent (default: default)
- `size`: sm | md | lg (default: md)

#### Card

```tsx
<Card variant="surface" shadow={true}>
  {children}
</Card>
```

Props:

- `variant`: surface | dark | accent | muted (default: surface)
- `shadow`: boolean (default: false)

#### Stack

```tsx
<Stack direction="vertical" gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

Props:

- `direction`: vertical | horizontal (default: vertical)
- `gap`: sm | md | lg (default: md)

### Misc

#### Badge

```tsx
<Badge variant="default">New</Badge>
```

Props:

- `variant`: default | accent (default: default)

#### Icon

```tsx
<Icon size="md">
  <svg>...</svg>
</Icon>
```

Props:

- `size`: sm | md | lg (default: md)

## Color System

### Text Colors

- `variant="primary"` → zinc-900
- `variant="secondary"` → zinc-700
- `variant="muted"` → zinc-500
- `variant="inverse"` → white
- `variant="accent"` → amber-500

### Background Colors

- `variant="surface"` → white
- `variant="default"` → zinc-50
- `variant="dark"` → zinc-900
- `variant="accent"` → amber-500

## Migration Guide

### Before

```html
<h1 class="text-4xl font-bold text-zinc-900">Heading</h1>
<p class="text-lg text-zinc-700">Body text</p>
```

### After

```tsx
<Heading level="h1" variant="primary">
  Heading
</Heading>
<Body variant="large">
  Body text
</Body>
```

```

---

## Immediate Action Items (Quick Wins)

### Priority 1: Critical (Do First)

**1. Delete Duplicate Components** (5 minutes)
- [ ] Delete `src/components/homepage/CallToAction.astro`
- [ ] Delete `src/components/homepage/Cooperation.astro`
- [ ] Update imports in pages to use `.tsx` versions

**2. Create Design Tokens File** (15 minutes)
- [ ] Create `src/lib/design-tokens.ts`
- [ ] Define color palette
- [ ] Define typography scale
- [ ] Define spacing scale

**3. Fix Heading Component** (2 minutes)
- [ ] Add h4-h6 support to `src/components/ui/heading.tsx`
- [ ] Remove error throw or make more helpful

### Priority 2: High Impact (Do Second)

**4. Rename Files to kebab-case** (10 minutes)
- [ ] Rename `Hero.astro` → `hero.astro`
- [ ] Rename `Clients.astro` → `clients.astro`
- [ ] Rename `References.astro` → `references.astro`
- [ ] Rename `Navigation.astro` → `navigation.astro`
- [ ] Rename `Footer.astro` → `footer.astro`
- [ ] Update all imports

**5. Replace Hardcoded Buttons** (20 minutes)
- [ ] Update `navigation.tsx` to use `Button` component
- [ ] Update `footer.astro` to use `Button` component
- [ ] Update `hero.astro` to use `Button` component

**6. Create Missing Components** (30 minutes)
- [ ] Create `src/components/ui/body.tsx`
- [ ] Create `src/components/ui/link.tsx`
- [ ] Create `src/components/ui/badge.tsx`

### Priority 3: Medium Impact (Do Third)

**7. Standardize Component Props** (1 hour)
- [ ] Rename `text` → `variant` in `heading.tsx`
- [ ] Rename `text` → `variant` in `text.tsx`
- [ ] Rename `color` → `variant` in `button.tsx`
- [ ] Rename `background` → `variant` in `section.tsx`
- [ ] Rename `background` → `variant` in `card.tsx`
- [ ] Update all component usages

**8. Refactor Navigation** (30 minutes)
- [ ] Replace custom `LinkItem` with `Badge` component
- [ ] Simplify navigation structure

---

## Metrics & Impact

### Before Standardization
- **Duplicate Components**: 3 pairs (6 total files)
- **Hardcoded Styles**: 48+ instances of hardcoded text colors
- **Naming Inconsistency**: 40% PascalCase, 60% kebab-case
- **Component Usage**: UI components bypassed in ~70% of code
- **Missing Components**: 6 core components don't exist

### After Standardization
- **Duplicate Components**: 0 (all React-based)
- **Hardcoded Styles**: <5 instances (only exceptional cases)
- **Naming Consistency**: 100% kebab-case
- **Component Usage**: UI components used in ~95% of code
- **Missing Components**: 0 (complete component library)

### Benefits
1. **Maintainability**: Single source of truth for styles
2. **Consistency**: Automated through component API
3. **Developer Experience**: Clear patterns, less decision fatigue
4. **Performance**: Smaller bundle (no duplicate implementations)
5. **Type Safety**: Full TypeScript coverage
6. **Scalability**: Easy to add new variants and components

---

## Conclusion

The codebase has a solid foundation with well-structured UI components, but inconsistent usage has led to drift. The proposed standardization plan addresses:

1. **Architectural clarity**: React for logic, Astro only for images
2. **Component discipline**: Use components, not hardcoded classes
3. **Naming consistency**: kebab-case everywhere
4. **Design system**: Centralized tokens and semantic naming
5. **Complete component library**: Fill gaps in core components

**Estimated Total Effort**: 10-15 hours to fully standardize

**Recommended Approach**: Implement in phases, starting with quick wins (delete duplicates, create design tokens) and progressively refactoring components.

**Next Steps**:
1. Review and approve this plan
2. Start with Priority 1 quick wins
3. Implement Phase 1 (Foundation)
4. Progressively refactor components
5. Update documentation
```
