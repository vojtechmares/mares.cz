import clsx from "clsx";
import { type ReactNode } from "react";

import { colors } from "../../lib/design-tokens";

type LinkVariant = "default" | "muted";

type LinkProps = {
  href: string;
  children: ReactNode;
  variant?: LinkVariant;
  external?: boolean;
  className?: string;
};

const focusStyles = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";

const variantStyles: Record<LinkVariant, string> = {
  default: `${colors.text.link} underline ${colors.text.linkHover} transition-colors ${focusStyles}`,
  muted: `${colors.text.muted} hover:${colors.text.primary} transition-colors ${focusStyles}`,
};

export function Link({ href, children, variant = "default", external = false, className }: LinkProps) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <a href={href} className={clsx(variantStyles[variant], className)} {...externalProps}>
      {children}
    </a>
  );
}
