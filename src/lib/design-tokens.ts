/**
 * Design Tokens
 *
 * Centralized design system tokens following the 60/30/10 color principle:
 * - 60% Neutral: neutral-100 backgrounds, white surfaces
 * - 30% Primary: neutral-900/700 text
 * - 10% Accent: orange-500 highlights
 */

// =============================================================================
// COLORS
// =============================================================================

export const colors = {
  // 60% - Neutral backgrounds
  background: {
    default: "bg-neutral-100",
    surface: "bg-white",
    inverse: "bg-neutral-900",
  },

  // 30% - Primary text
  text: {
    primary: "text-neutral-900",
    secondary: "text-neutral-700",
    muted: "text-neutral-300",
    inverse: "text-white",
    // Link colors - orange-800 for WCAG AA compliance
    link: "text-orange-800",
    linkHover: "hover:text-orange-900",
  },

  // 10% - Accent
  accent: {
    default: "bg-orange-500",
    hover: "hover:bg-orange-600",
    text: "text-orange-500",
    light: "bg-orange-100",
  },

  // Borders - Design System Manual specs
  border: {
    // Light background borders
    default: "border-neutral-300",
    hover: "border-neutral-500",
    // Dark background borders
    dark: "border-neutral-700",
    // Emphasis border (2px)
    emphasis: "border-2",
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // Heading sizes - Design System Manual specs
  // H1: 48px/3rem, Inter Bold, -0.02em, line-height 1.1
  // H2: 36px/2.25rem, Inter SemiBold, -0.015em, line-height 1.2
  // H3: 28px/1.75rem, Inter SemiBold, -0.01em, line-height 1.3
  // H4: 20px/1.25rem, Inter Medium, line-height 1.4
  // H5: 18px/1.125rem, Inter SemiBold, line-height 1.5
  // H6: 16px/1rem, Inter SemiBold, line-height 1.5
  heading: {
    h1: "text-5xl font-display font-bold leading-[1.1] tracking-[-0.02em]",
    h2: "text-4xl font-display font-semibold leading-[1.2] tracking-[-0.015em]",
    h3: "text-[1.75rem] font-display font-semibold leading-[1.3] tracking-[-0.01em]",
    h4: "text-xl font-sans font-medium leading-[1.4]",
    h5: "text-lg font-sans font-semibold leading-[1.5]",
    h6: "text-base font-sans font-semibold leading-[1.5]",
  },

  // Body text sizes - Space Mono
  body: {
    large: "text-lg font-sans leading-[1.6] tracking-[0.01em]",
    base: "text-base font-sans leading-[1.6] tracking-[0.01em]",
    small: "text-sm font-sans leading-[1.5] tracking-[0.01em]",
  },

  // Display font settings
  display: "font-display tracking-tight",
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  // Section vertical padding - 8px grid aligned
  section: "py-16 sm:py-24",

  // Card padding - 8px grid aligned
  card: "px-8 py-8",

  // Container horizontal padding - Design System Manual specs
  // Mobile: 16px, Tablet: 24px, Desktop small: 32px, Desktop: 40px
  container: "px-4 md:px-6 lg:px-8 xl:px-10",

  // Max widths
  maxWidth: {
    standard: "max-w-[1280px]", // Standard container
    prose: "max-w-prose", // 65ch for articles
  },

  // Gap utilities - 8px grid
  gap: {
    xs: "gap-1", // 4px
    sm: "gap-2", // 8px
    md: "gap-4", // 16px
    lg: "gap-6", // 24px
    xl: "gap-8", // 32px
    "2xl": "gap-12", // 48px
    "3xl": "gap-16", // 64px
  },
} as const;

// =============================================================================
// RADIUS
// =============================================================================

export const radius = {
  // none: "rounded-none",
  // sm: "rounded-lg",
  // md: "rounded-2xl",
  // lg: "rounded-3xl",
  // full: "rounded-full",
  none: "rounded-none",
  sm: "rounded-none",
  md: "rounded-none",
  lg: "rounded-none",
  full: "rounded-none",
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type HeadingLevel = keyof typeof typography.heading;
export type BodySize = keyof typeof typography.body;
export type GapSize = keyof typeof spacing.gap;
