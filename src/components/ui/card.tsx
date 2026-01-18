import clsx from "clsx";
import { type ReactNode } from "react";

import { colors, spacing, radius, shadows } from "../../lib/design-tokens";

type CardVariant = "surface" | "inverse" | "accent" | "default" | "accent-light";
type CardBorder = "none";

type CardProps = {
  children?: ReactNode;
  variant?: CardVariant;
  className?: string;
  border?: CardBorder;
  shadow?: boolean;
  hover?: boolean;
};

const variantStyles: Record<CardVariant, string> = {
  surface: `${colors.background.surface} shadow-xl shadow-zinc-900/10`,
  inverse: colors.background.inverse,
  accent: colors.accent.default,
  default: `${colors.background.default} inset-shadow-sm inset-shadow-zinc-900/10`,
  "accent-light": colors.accent.light,
};

const borderStyles: Record<CardBorder, string> = {
  none: "border-none",
};

const baseStyles = `overflow-hidden ${radius.lg} ${spacing.card}`;

const hoverStyles = "transition duration-300 ease hover:-translate-y-0.5 ring-1 ring-transparent hover:ring-amber-500";

export function Card({
  children,
  className,
  variant = "default",
  border = "none",
  shadow: showShadow = false,
  hover = false,
}: CardProps) {
  return (
    <section
      className={clsx(
        variantStyles[variant],
        borderStyles[border],
        baseStyles,
        showShadow ? shadows.md : "",
        hover ? hoverStyles : "",
        className,
      )}
    >
      {children}
    </section>
  );
}
