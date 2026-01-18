import clsx from "clsx";
import { type ReactNode } from "react";

import { colors, radius } from "../../lib/design-tokens";

type BadgeVariant = "default" | "accent";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  as?: "span" | "a";
  href?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  default: `${colors.background.default} ${colors.text.primary}`,
  accent: `${colors.accent.default} ${colors.text.inverse}`,
};

const baseStyles = `inline-block ${radius.full} px-4 py-2 text-base font-bold`;

export function Badge({ children, variant = "default", className, as = "span", href }: BadgeProps) {
  const combinedClassName = clsx(baseStyles, variantStyles[variant], className);

  if (as === "a" && href) {
    return (
      <a href={href} className={combinedClassName}>
        {children}
      </a>
    );
  }

  return <span className={combinedClassName}>{children}</span>;
}
