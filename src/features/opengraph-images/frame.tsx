import type { CSSProperties, ReactNode } from "react";

import { color, font } from "../../lib/design-tokens";

// Cards are always rendered in the light theme - social previews have no dark mode.
const c = color.light;

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const PADDING_X = 64;
const PADDING_Y = 52;
const PORTRAIT_WIDTH = 380;
const PORTRAIT_GAP = 56;
const ICON_SIZE = 56;
const ICON_GAP = 24;

const TITLE_SIZES = [76, 68, 60, 52] as const;
const TITLE_MAX_LINES = 3;
const TITLE_LINE_HEIGHT = 1.08;
// Average glyph advance of IBM Plex Sans 600 relative to the font size, slightly
// pessimistic so the estimated line count never undershoots the real one.
const TITLE_GLYPH_RATIO = 0.56;

export interface OgStat {
  label: string;
  value: string;
  /** Takes all the spare room in the row, for values such as tag lists. */
  wide?: boolean;
}

function estimateLines(text: string, fontSize: number, width: number): number {
  return Math.ceil((text.length * fontSize * TITLE_GLYPH_RATIO) / width);
}

/** Pick the largest title size that fits two lines, falling back to the smallest size on three. */
function fitTitle(text: string, width: number): { fontSize: number; lines: number } {
  for (const fontSize of TITLE_SIZES) {
    const lines = estimateLines(text, fontSize, width);
    if (lines <= 2) return { fontSize, lines };
  }
  const fontSize = TITLE_SIZES[TITLE_SIZES.length - 1] ?? 52;
  return { fontSize, lines: Math.min(estimateLines(text, fontSize, width), TITLE_MAX_LINES) };
}

function clamp(lines: number): CSSProperties {
  return {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lines,
    overflow: "hidden",
  };
}

const mono: CSSProperties = { fontFamily: font.mono, fontWeight: 400, letterSpacing: ".02em" };

const singleLine: CSSProperties = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

export function OgWordmark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ width: 12, height: 12, backgroundColor: c.accent }} />
      <span style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 24, color: c.ink }}>Vojtěch Mareš</span>
    </div>
  );
}

export function OgUrl({ children }: { children: ReactNode }) {
  return <span style={{ ...mono, ...singleLine, fontSize: 18, color: c.faint, maxWidth: 720 }}>{children}</span>;
}

export function OgEyebrow({ children }: { children: string }) {
  return <div style={{ ...mono, fontSize: 20, color: c.accent }}>{`// ${children}`}</div>;
}

export function OgTitle({ children, fontSize }: { children: ReactNode; fontSize: number }) {
  return (
    <div
      style={{
        ...clamp(TITLE_MAX_LINES),
        fontFamily: font.sans,
        fontWeight: 600,
        fontSize,
        lineHeight: TITLE_LINE_HEIGHT,
        letterSpacing: "-.025em",
        color: c.ink,
        textWrap: "pretty",
        // Room for descenders, which the line clamp would otherwise crop.
        paddingBottom: ".1em",
      }}
    >
      {children}
    </div>
  );
}

export function OgDescription({ children, lines = 3 }: { children: ReactNode; lines?: number }) {
  return (
    <p
      style={{
        ...clamp(lines),
        fontFamily: font.sans,
        fontWeight: 400,
        fontSize: 26,
        lineHeight: 1.45,
        color: c.muted,
        maxWidth: 920,
        textWrap: "pretty",
      }}
    >
      {children}
    </p>
  );
}

export function OgMeta({ children }: { children: ReactNode }) {
  return <div style={{ ...mono, ...singleLine, fontSize: 18, color: c.ink }}>{children}</div>;
}

export function OgStats({ stats }: { stats: OgStat[] }) {
  // Next to a wide cell the others shrink to their content, so a tag list gets all the spare room.
  const hasWide = stats.some((stat) => stat.wide);

  return (
    <div style={{ display: "flex", borderTop: `1px solid ${c.ink}` }}>
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          style={{
            flex: hasWide && !stat.wide ? "0 0 auto" : "1 1 0",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 6,
            padding: index === 0 ? "18px 24px 0 0" : "18px 24px 0",
            borderLeft: index === 0 ? "none" : `1px solid ${c.rule}`,
          }}
        >
          <span style={{ ...mono, ...clamp(2), fontSize: 14, lineHeight: 1.4, color: c.muted }}>{stat.label}</span>
          <span style={{ ...mono, ...singleLine, letterSpacing: 0, fontSize: 26, lineHeight: 1.25, color: c.ink }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Author cut-out standing on the bottom edge, in front of the placeholder hatch panel. */
function OgPortrait({ src }: { src: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: PADDING_Y,
        right: PADDING_X,
        bottom: 0,
        width: PORTRAIT_WIDTH,
        overflow: "hidden",
        border: `1px solid ${c.rule}`,
        borderBottom: "none",
        backgroundImage: `repeating-linear-gradient(135deg, ${c.shade} 0 8px, ${c.shade2} 8px 16px)`,
      }}
    >
      <img
        alt=""
        src={src}
        style={{ position: "absolute", bottom: 0, left: "50%", height: "96%", transform: "translateX(-50%)" }}
      />
    </div>
  );
}

export interface OgFrameProps {
  /** Page address without protocol, e.g. `mares.cz/blog`. */
  url: string;
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  /** Single mono line under the description (tags, bullet list). */
  meta?: string | undefined;
  /** Technology icon rendered in ink monochrome next to the title. */
  icon?: string | undefined;
  stats?: OgStat[] | undefined;
  /** Author portrait URL; reserves the right-hand column for it. */
  portrait?: string | undefined;
}

export function OgFrame({ url, eyebrow, title, description, meta, icon, stats, portrait }: OgFrameProps) {
  const hasStats = stats !== undefined && stats.length > 0;
  const contentWidth = CARD_WIDTH - 2 * PADDING_X - (portrait !== undefined ? PORTRAIT_WIDTH + PORTRAIT_GAP : 0);
  const titleWidth = contentWidth - (icon !== undefined ? ICON_SIZE + ICON_GAP : 0);
  const { fontSize, lines } = fitTitle(title, titleWidth);
  const descriptionLines = lines >= TITLE_MAX_LINES && hasStats ? 2 : 3;

  return (
    <div
      style={{
        position: "relative",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        overflow: "hidden",
        backgroundColor: c.bg,
        color: c.ink,
        fontFamily: font.sans,
      }}
    >
      <div
        style={{
          width: contentWidth + 2 * PADDING_X,
          height: "100%",
          padding: `${PADDING_Y}px ${PADDING_X}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <OgWordmark />
          {portrait === undefined && <OgUrl>{url}</OgUrl>}
        </div>

        <div
          style={{
            flex: "1 1 0",
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {eyebrow !== undefined && <OgEyebrow>{eyebrow}</OgEyebrow>}
          <div style={{ display: "flex", alignItems: "flex-start", gap: ICON_GAP }}>
            {icon !== undefined && (
              <img
                alt=""
                src={icon}
                width={ICON_SIZE}
                height={ICON_SIZE}
                style={{
                  flex: "none",
                  objectFit: "contain",
                  // Centre the icon on the first title line.
                  marginTop: (fontSize * TITLE_LINE_HEIGHT - ICON_SIZE) / 2,
                  filter: "grayscale(1) contrast(1.4) brightness(0.55)",
                }}
              />
            )}
            <OgTitle fontSize={fontSize}>{title}</OgTitle>
          </div>
          {description !== undefined && <OgDescription lines={descriptionLines}>{description}</OgDescription>}
          {meta !== undefined && <OgMeta>{meta}</OgMeta>}
        </div>

        {hasStats && <OgStats stats={stats} />}
        {portrait !== undefined && <OgUrl>{url}</OgUrl>}
      </div>

      {portrait !== undefined && <OgPortrait src={portrait} />}
    </div>
  );
}
