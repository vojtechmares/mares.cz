import clsx from "clsx";
import { type ReactNode } from "react";
import { colors, spacing, radius, shadows } from "../../lib/design-tokens";

type CardVariant =
  | "surface"
  | "inverse"
  | "accent"
  | "default"
  | "accent-light";
type CardBorder = "none";

type CardProps = {
  children?: ReactNode;
  variant?: CardVariant;
  className?: string;
  border?: CardBorder;
  shadow?: boolean;
};

const variantStyles: Record<CardVariant, string> = {
  surface: `${colors.background.surface} shadow-xl shadow-zinc-900/10`,
  inverse: colors.background.inverse,
  accent: colors.accent.default,
  default: `${colors.background.default} shadow-xl shadow-zinc-900/10`,
  "accent-light": colors.accent.light,
};

const borderStyles: Record<CardBorder, string> = {
  none: "border-none",
};

const baseStyles = `overflow-hidden ${radius.lg} ${spacing.card}`;

export function Card({
  children,
  className,
  variant = "default",
  border = "none",
  shadow: showShadow = false,
}: CardProps) {
  return (
    <section
      className={clsx(
        variantStyles[variant],
        borderStyles[border],
        baseStyles,
        showShadow ? shadows.md : "",
        className,
      )}
    >
      {children}
    </section>
  );
}
