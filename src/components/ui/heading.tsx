import clsx from "clsx";
import { type ReactNode } from "react";
import { typography, colors, type HeadingLevel } from "../../lib/design-tokens";

type HeadingVariant = "primary" | "inverse" | "accent";

type HeadingProps = {
  children?: ReactNode;
  className?: string;
  level?: HeadingLevel;
  ariaLabel?: string;
  variant?: HeadingVariant;
  id?: string;
};

const variantStyles: Record<HeadingVariant, string> = {
  primary: colors.text.primary,
  inverse: colors.text.inverse,
  accent: colors.accent.text,
};

export function Heading({
  children,
  className,
  level = "h1",
  variant = "primary",
  id = undefined,
  ariaLabel,
}: HeadingProps) {
  const Tag = level;

  return (
    <Tag
      className={clsx(
        className,
        typography.heading[level],
        variantStyles[variant],
        typography.display,
      )}
      aria-label={ariaLabel}
      id={id}
    >
      {children}
    </Tag>
  );
}
