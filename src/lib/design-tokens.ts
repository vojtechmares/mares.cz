/**
 * Design Tokens
 *
 * Centralized design system tokens following the 60/30/10 color principle:
 * - 60% Neutral: zinc-100 backgrounds, white surfaces
 * - 30% Primary: zinc-900/700 text
 * - 10% Accent: amber-500 highlights
 */

// =============================================================================
// COLORS
// =============================================================================

export const colors = {
  // 60% - Neutral backgrounds
  background: {
    default: "bg-zinc-100",
    surface: "bg-white",
    inverse: "bg-zinc-900",
  },

  // 30% - Primary text
  text: {
    primary: "text-zinc-900",
    secondary: "text-zinc-700",
    muted: "text-zinc-300",
    inverse: "text-white",
  },

  // 10% - Accent
  accent: {
    default: "bg-amber-500",
    hover: "hover:bg-amber-600",
    text: "text-amber-500",
    light: "bg-amber-100",
  },

  // Borders
  border: {
    default: "border-zinc-200",
    muted: "border-zinc-300",
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // Heading sizes (responsive)
  heading: {
    h1: "text-4xl sm:text-5xl font-bold",
    h2: "text-3xl sm:text-4xl font-bold",
    h3: "text-2xl sm:text-3xl font-medium",
    h4: "text-xl sm:text-2xl font-medium",
    h5: "text-lg sm:text-xl font-medium",
    h6: "text-base sm:text-lg font-medium",
  },

  // Body text sizes
  body: {
    large: "text-lg",
    base: "text-base",
    small: "text-sm",
  },

  // Display font settings
  display: "font-display tracking-tight",
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  // Section vertical padding
  section: {
    sm: "py-12 sm:py-16",
    md: "py-20 sm:py-32",
    lg: "py-32 sm:py-40",
  },

  // Card padding
  card: "px-4 py-8 sm:px-8",

  // Container horizontal padding
  container: "px-4 lg:px-8",

  // Gap utilities
  gap: {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  },
} as const;

// =============================================================================
// RADIUS
// =============================================================================

export const radius = {
  none: "rounded-none",
  sm: "rounded-lg",
  md: "rounded-2xl",
  lg: "rounded-3xl",
  full: "rounded-full",
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

export type BackgroundColor = keyof typeof colors.background;
export type TextColor = keyof typeof colors.text;
export type AccentColor = keyof typeof colors.accent;
export type BorderColor = keyof typeof colors.border;
export type HeadingLevel = keyof typeof typography.heading;
export type BodySize = keyof typeof typography.body;
export type SectionSize = keyof typeof spacing.section;
export type GapSize = keyof typeof spacing.gap;
export type RadiusSize = keyof typeof radius;
export type ShadowSize = keyof typeof shadows;
