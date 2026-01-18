import clsx from "clsx";
import { type ReactNode } from "react";

import { colors } from "../../lib/design-tokens";

type TextVariant = "primary" | "secondary" | "muted" | "inverse";

type TextProps = {
  children?: ReactNode;
  className?: string;
  variant?: TextVariant;
};

const variantStyles: Record<TextVariant, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  muted: colors.text.muted,
  inverse: colors.text.inverse,
};

export function Text({ children, className, variant = "primary" }: TextProps) {
  return <p className={clsx(className, variantStyles[variant])}>{children}</p>;
}
