---
name: ui-components
description: Use project UI components instead of native HTML elements. Provides consistent styling, design tokens, and accessibility. Reference this when creating or modifying React/TSX components.
---

# UI Components Library

This project uses a custom UI component library built on design tokens. Always use these components instead of native HTML elements when building UI.

## Quick Reference

| HTML Element                         | Component   | Import                      |
| ------------------------------------ | ----------- | --------------------------- |
| `<h1>` - `<h6>`                      | `Heading`   | `@/components/ui/heading`   |
| `<a>`                                | `Link`      | `@/components/ui/link`      |
| `<button>`, `<a>` (CTA)              | `Button`    | `@/components/ui/button`    |
| `<p>`, `<span>`, `<div>` (body text) | `Body` ★    | `@/components/ui/body`      |
| `<p>` (section intros only)          | `Text`      | `@/components/ui/text`      |
| `<section>` (card)                   | `Card`      | `@/components/ui/card`      |
| `<section>` (page section)           | `Section`   | `@/components/ui/section`   |
| `<div>` (container)                  | `Container` | `@/components/ui/container` |
| `<div>` (flex layout)                | `Stack`     | `@/components/ui/stack`     |
| `<span>` (label)                     | `Badge`     | `@/components/ui/badge`     |
| `<span>` (icon wrapper)              | `Icon`      | `@/components/ui/icon`      |
| `<span>` + tags                      | `TagList`   | `@/components/ui/tag-list`  |

★ **Body is the primary choice for body text.** Use in cards, content areas, and anywhere body text is needed.

## Import Convention

Always use relative imports from the component location:

```tsx
import { Heading } from "../../components/ui/heading";
import { Section } from "../../components/ui/section";
import { Container } from "../../components/ui/container";
```

---

## Component Reference

### Heading

Replaces `<h1>` through `<h6>`. Uses Inter font with design system typography.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `"h1"` \| `"h2"` \| `"h3"` \| `"h4"` \| `"h5"` \| `"h6"` | `"h1"` | Semantic heading level |
| `variant` | `"primary"` \| `"inverse"` \| `"accent"` | `"primary"` | Color variant |
| `id` | `string` | - | HTML id attribute |
| `ariaLabel` | `string` | - | Accessibility label |

**Examples:**

```tsx
// Section heading
<Heading level="h2">Školení</Heading>

// Card heading
<Heading level="h3">Vojtěch Mareš</Heading>

// Hero heading with accent color
<Heading level="h1" variant="accent">Welcome</Heading>

// Heading on dark background
<Heading level="h2" variant="inverse">Contact</Heading>
```

---

### Link

Replaces `<a>`. Handles external links automatically with proper security attributes.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | required | Link destination |
| `variant` | `"default"` \| `"muted"` | `"default"` | Color style |
| `external` | `boolean` | `false` | Opens in new tab with `noopener noreferrer` |

**Examples:**

```tsx
// Internal link
<Link href="/skoleni/kubernetes">Kubernetes školení</Link>

// External link
<Link href="https://github.com/vojtechmares" external>
  GitHub
</Link>

// Muted link (for less prominent links)
<Link href="/terms" variant="muted">Terms</Link>

// Email/phone links
<Link href="tel:+420732490651">+420 732 490 651</Link>
<Link href="mailto:vojtech@mares.cz">vojtech@mares.cz</Link>
```

---

### Button

Replaces `<button>` and call-to-action `<a>` elements. Renders as `<a>` when `href` is provided.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | - | If set, renders as `<a>` |
| `style` | `"solid"` \| `"outline"` | `"solid"` | Button style |
| `variant` | `"primary"` \| `"secondary"` \| `"accent"` | `"primary"` | Color variant |
| `size` | `"medium"` \| `"large"` | `"large"` | Button size |
| `onClick` | `() => void` | - | Click handler (for button mode) |

**Note:** Outline style cannot be combined with accent variant.

**Examples:**

```tsx
// Primary CTA link
<Button href="/contact">Kontaktujte mě</Button>

// Secondary button
<Button href="/pricing" variant="secondary">Ceník</Button>

// Medium size button
<Button href="mailto:vojtech@mares.cz" size="medium">
  Napište mi
</Button>

// Outline button
<Button href="/learn-more" style="outline" variant="primary">
  Více informací
</Button>

// Click handler button
<Button onClick={() => handleSubmit()}>Odeslat</Button>
```

---

### Text

Simple paragraph for section introductions. **For body text in cards and content areas, use `Body` instead.**

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary"` \| `"secondary"` \| `"muted"` \| `"inverse"` | `"primary"` | Text color |

**Examples:**

```tsx
// Section introduction text (after a Heading)
<Heading level="h2">Services</Heading>
<Text variant="secondary">What I can help you with.</Text>

// On dark section backgrounds
<Section variant="inverse">
  <Heading level="h2" variant="inverse">Contact</Heading>
  <Text variant="muted">Get in touch.</Text>
</Section>
```

---

### Body

**Primary choice for body text.** Flexible component with size variants and element choice. Uses Space Mono font.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"large"` \| `"base"` \| `"small"` | `"base"` | Text size |
| `color` | `"primary"` \| `"secondary"` \| `"muted"` \| `"inverse"` | `"primary"` | Text color |
| `as` | `"p"` \| `"span"` \| `"div"` | `"p"` | HTML element |

**Examples:**

```tsx
// Card description (most common use)
<Card variant="surface">
  <Heading level="h3">Title</Heading>
  <Body color="secondary">Card description text.</Body>
</Card>

// Large intro text
<Body variant="large">Welcome to my website.</Body>

// Inline metadata
<Body as="span" variant="small" color="muted">
  Last updated: Jan 2025
</Body>

// On dark cards
<Card variant="inverse">
  <Heading level="h3" variant="inverse">Title</Heading>
  <Body color="muted">Description on dark background.</Body>
</Card>
```

---

### Card

Replaces `<section>` for card-style containers. Includes padding and optional shadow/hover effects.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default"` \| `"surface"` \| `"inverse"` \| `"accent"` \| `"accent-light"` | `"default"` | Background style |
| `shadow` | `boolean` | `false` | Add shadow |
| `hover` | `boolean` | `false` | Add hover lift effect |

**Examples:**

```tsx
// Basic card
<Card>
  <Heading level="h3">Title</Heading>
  <Body>Content here.</Body>
</Card>

// White surface card with shadow
<Card variant="surface" shadow>
  <Heading level="h3">Featured</Heading>
</Card>

// Interactive card with hover
<Card variant="surface" hover>
  <Link href="/article">Read more</Link>
</Card>

// Accent highlight card
<Card variant="accent">
  <Heading level="h3" variant="inverse">Special</Heading>
</Card>
```

---

### Section

Full-width page section with background variants and vertical padding.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default"` \| `"surface"` \| `"inverse"` \| `"accent"` | `"default"` | Background color |
| `id` | `string` | - | HTML id for anchor links |
| `ariaLabel` | `string` | - | Accessibility label |

**Examples:**

```tsx
// Standard section
<Section>
  <Container>
    <Heading level="h2">About</Heading>
  </Container>
</Section>

// Dark section
<Section variant="inverse">
  <Container>
    <Heading level="h2" variant="inverse">Contact</Heading>
  </Container>
</Section>

// Section with anchor
<Section id="pricing" ariaLabel="Pricing information">
  <Container>...</Container>
</Section>
```

---

### Container

Width-constrained container with responsive horizontal padding.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"default"` \| `"prose"` | `"default"` | Width mode |

- `default`: 1280px max-width
- `prose`: 65ch max-width (for long-form content)

**Examples:**

```tsx
// Standard container
<Container>
  <div className="grid grid-cols-3 gap-4">...</div>
</Container>

// Prose container for articles
<Container mode="prose">
  <article>
    <Heading level="h1">Article Title</Heading>
    <Text>Long form content...</Text>
  </article>
</Container>
```

---

### Stack

Flexbox layout component for vertical/horizontal stacking.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `"vertical"` \| `"horizontal"` | `"vertical"` | Stack direction |
| `gap` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"2xl"` \| `"3xl"` | `"md"` | Space between items |
| `align` | `"start"` \| `"center"` \| `"end"` \| `"stretch"` | - | Cross-axis alignment |
| `justify` | `"start"` \| `"center"` \| `"end"` \| `"between"` \| `"around"` | - | Main-axis alignment |

**Gap sizes:** xs=4px, sm=8px, md=16px, lg=24px, xl=32px, 2xl=48px, 3xl=64px

**Examples:**

```tsx
// Vertical stack (default)
<Stack gap="lg">
  <Heading level="h2">Title</Heading>
  <Text>Description</Text>
  <Button href="/cta">Action</Button>
</Stack>

// Horizontal stack centered
<Stack direction="horizontal" gap="md" align="center">
  <Icon><SomeIcon /></Icon>
  <Body>Label text</Body>
</Stack>

// Space between items
<Stack direction="horizontal" justify="between">
  <Body>Left</Body>
  <Body>Right</Body>
</Stack>
```

---

### Badge

Inline label/tag component. Can render as link when `as="a"`.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default"` \| `"accent"` | `"default"` | Color style |
| `as` | `"span"` \| `"a"` | `"span"` | HTML element |
| `href` | `string` | - | Link destination (when `as="a"`) |

**Examples:**

```tsx
// Status badge
<Badge>New</Badge>

// Accent badge
<Badge variant="accent">Featured</Badge>

// Clickable badge
<Badge as="a" href="/category/devops">DevOps</Badge>
```

---

### Icon

SVG wrapper with size presets and accessibility support.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Icon size |
| `label` | `string` | - | Accessibility label |

**Sizes:** sm=16px, md=24px, lg=32px

**Examples:**

```tsx
// Icon with label
<Icon label="GitHub" size="md">
  <GitHubSvg />
</Icon>

// Small decorative icon
<Icon size="sm">
  <ChevronRight />
</Icon>
```

---

### TagList

Renders a list of hashtag links for blog tags.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tags` | `string[]` | required | Array of tag names |
| `variant` | `"default"` \| `"inverse"` | `"default"` | Color style |
| `activeTag` | `string` | - | Currently active tag (bold) |

**Examples:**

```tsx
// Blog post tags
<TagList tags={["kubernetes", "docker", "devops"]} />

// On dark background
<TagList tags={["cloud"]} variant="inverse" />

// With active filter
<TagList tags={post.tags} activeTag={currentFilter} />
```

---

## Common Layout Patterns

### Page Section with Container

```tsx
<Section variant="surface">
  <Container>
    <Stack gap="xl">
      <Heading level="h2">Section Title</Heading>
      <Text>Section description.</Text>
    </Stack>
  </Container>
</Section>
```

### Card Grid

```tsx
<Section>
  <Container>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card variant="surface" shadow hover>
        <Heading level="h3">Card 1</Heading>
        <Body color="secondary">Card description text.</Body>
      </Card>
      {/* more cards */}
    </div>
  </Container>
</Section>
```

### Article Layout

```tsx
<Section>
  <Container mode="prose">
    <Stack gap="lg">
      <Heading level="h1">{article.title}</Heading>
      <TagList tags={article.tags} />
      <Body variant="large" color="secondary">
        {article.excerpt}
      </Body>
      <Prose content={article.content} />
    </Stack>
  </Container>
</Section>
```

### Footer with Links

```tsx
<Section className="border-t border-zinc-300">
  <Container>
    <Heading level="h3">Contact</Heading>
    <ul>
      <li>
        <Link href="tel:+420123456789">Phone</Link>
      </li>
      <li>
        <Link href="mailto:email@example.com">Email</Link>
      </li>
    </ul>
    <Button href="/contact" size="medium">
      Get in touch
    </Button>
  </Container>
</Section>
```

---

## Design Tokens

Components use design tokens from `src/lib/design-tokens.ts`:

- **Colors:** 60/30/10 rule (zinc backgrounds, zinc text, amber accent)
- **Typography:** Inter for headings, Space Mono for body
- **Spacing:** 8px grid system
- **Radius:** Currently disabled (all `rounded-none`)
