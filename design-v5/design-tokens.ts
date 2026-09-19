/**
 * mares.cz design tokens
 * Single source of truth. Emit as CSS custom properties at the app root;
 * never hardcode a hex in a component.
 */

export const color = {
  light: {
    bg: '#FAF8F5',        // page — warm off-white, not neutral gray
    surface: '#FFFFFF',   // cards, diagram windows, code blocks on bg
    ink: '#1C1917',       // primary text, strong rules
    muted: '#6B655D',     // body prose, secondary text
    faint: '#A39C92',     // captions, figure numbers, units, meta
    rule: '#E4DED4',      // default hairline
    rule2: '#D9D2C7',     // dashed / secondary hairline
    shade: '#EEE9E1',     // placeholder hatch (dark stripe)
    shade2: '#F6F2EC',    // placeholder hatch (light stripe)
    code: '#F1ECE4',      // inline <code> background
    accent: '#E8590C',
    accent2: '#CF4E0A',   // accent hover / pressed
    onAccent: '#FFFFFF',  // text on accent fill
    bgVeil: 'rgba(250,248,245,.92)', // sticky header backdrop
  },
  dark: {
    bg: '#14120F',        // warm near-black, same hue family as bg-light
    surface: '#1B1815',
    ink: '#F2EEE8',
    muted: '#A8A096',
    faint: '#777066',
    rule: '#2E2A25',
    rule2: '#3E3831',
    shade: '#262220',
    shade2: '#1F1C19',
    code: '#242020',
    accent: '#FF7A33',    // lifted: #E8590C goes muddy on dark
    accent2: '#FF9457',
    onAccent: '#14120F',  // dark text on accent — white fails contrast here
    bgVeil: 'rgba(20,18,15,.92)',
  },
} as const;

export type ThemeName = keyof typeof color;
export type ColorToken = keyof typeof color.light;

export const font = {
  sans: "'IBM Plex Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

/** [size, lineHeight, letterSpacing, weight] */
export const type = {
  hero:       { size: '52px', lh: 1.08, ls: '-.025em', weight: 600, family: 'sans' },
  pageTitle:  { size: '44px', lh: 1.1,  ls: '-.025em', weight: 600, family: 'sans' },
  postTitle:  { size: '48px', lh: 1.08, ls: '-.025em', weight: 600, family: 'sans' },
  h2:         { size: '32px', lh: 1.15, ls: '-.02em',  weight: 600, family: 'sans' },
  h3:         { size: '28px', lh: 1.2,  ls: '-.02em',  weight: 600, family: 'sans' },
  lead:       { size: '19px', lh: 1.55, ls: '0',       weight: 400, family: 'sans' },
  rowTitle:   { size: '18px', lh: 1.4,  ls: '0',       weight: 500, family: 'sans' },
  body:       { size: '17px', lh: 1.7,  ls: '0',       weight: 400, family: 'sans' },
  bodySm:     { size: '16px', lh: 1.6,  ls: '0',       weight: 400, family: 'sans' },
  rowBody:    { size: '15px', lh: 1.5,  ls: '0',       weight: 400, family: 'sans' },
  uiSans:     { size: '14px', lh: 1.4,  ls: '0',       weight: 400, family: 'sans' },
  monoUi:     { size: '13px', lh: 1.6,  ls: '.02em',   weight: 400, family: 'mono' }, // nav, labels, buttons, code
  monoSm:     { size: '12px', lh: 1.6,  ls: '.02em',   weight: 400, family: 'mono' }, // diagram labels, eyebrows
  monoXs:     { size: '11px', lh: 1.5,  ls: '.02em',   weight: 400, family: 'mono' }, // figcaptions, legal
  monoXxs:    { size: '10px', lh: 1.4,  ls: '.04em',   weight: 400, family: 'mono' }, // pod labels inside diagrams
} as const;

/** 4px base. Section rhythm is deliberately airy. */
export const space = {
  0: '0', 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px',
  6: '24px', 8: '32px', 10: '40px', 12: '48px', 16: '64px',
  18: '72px', 22: '88px', 24: '96px', 26: '104px',
} as const;

export const layout = {
  maxWidth: '1120px',
  gutter: '32px',
  /** vertical padding per section: first section on a page vs. subsequent */
  sectionFirst: '96px 32px 72px',
  section: '88px 32px 0',
  sectionLast: '88px 32px 104px',
  proseWidth: '760px',   // article column
  measure: '60ch',       // long prose
  measureShort: '46ch',  // hero subhead, lead paragraphs
  headerHeight: '60px',
} as const;

export const radius = {
  none: '0',
  xs: '1px',    // ticks, tiny marks
  sm: '2px',    // code chips, portrait placeholders
  md: '3px',    // buttons, node boxes, pods
  lg: '4px',    // diagram windows, cards, code blocks
  full: '50%',
} as const;

export const border = {
  hairline: '1px solid var(--rule)',
  hairlineSoft: '1px dashed var(--rule2)',
  strong: '1px solid var(--ink)', // table head rule, emphasis dividers
} as const;

/** No shadows anywhere. Depth comes from 1px rules only. */
export const elevation = { none: 'none' } as const;

export const motion = {
  /** All diagram loops. Long, calm, infinite — never a one-shot reveal. */
  loop: { duration: '12s', timing: 'linear', iteration: 'infinite' },
  loopFast: { duration: '4s', timing: 'ease-in-out', iteration: 'infinite' },
  ui: { duration: '120ms', timing: 'ease-out' },
  /** Respect prefers-reduced-motion: freeze loops at their resting frame. */
  reducedMotion: 'paused',
} as const;

export const tokens = { color, font, type, space, layout, radius, border, elevation, motion } as const;
export default tokens;

/** Emit a theme as CSS custom properties: Object.assign(el.style, cssVars('dark')) */
export function cssVars(theme: ThemeName = 'light'): Record<string, string> {
  const kebab = (k: string) => k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
  return Object.fromEntries(
    Object.entries(color[theme]).map(([k, v]) => [`--${kebab(k)}`, v])
  );
}
