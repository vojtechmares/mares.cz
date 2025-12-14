import clsx from "clsx";
import { type ReactNode } from "react";
import { colors, spacing, type SectionSize } from "../../lib/design-tokens";

type SectionVariant = "surface" | "inverse" | "accent" | "default";

type SectionProps = {
  children?: ReactNode;
  className?: string;
  variant?: SectionVariant;
  size?: SectionSize;
  id?: string;
  ariaLabel?: string;
};

const variantStyles: Record<SectionVariant, string> = {
  surface: colors.background.surface,
  inverse: colors.background.inverse,
  accent: colors.accent.default,
  default: colors.background.default,
};

export function Section({
  children,
  className,
  id,
  ariaLabel,
  variant = "default",
  size = "md",
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={clsx(className, variantStyles[variant], spacing.section[size])}
    >
      {children}
    </section>
  );
}
