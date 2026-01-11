import clsx from "clsx";
import { type ReactNode } from "react";
import { colors } from "../../lib/design-tokens";

type LinkVariant = "default" | "underline" | "muted";

type LinkProps = {
  href: string;
  children: ReactNode;
  variant?: LinkVariant;
  external?: boolean;
  className?: string;
};

const variantStyles: Record<LinkVariant, string> = {
  default: `${colors.text.primary} hover:${colors.accent.text} transition-colors`,
  underline: `${colors.text.primary} underline hover:${colors.accent.text} transition-colors`,
  muted: `${colors.text.muted} hover:${colors.text.primary} transition-colors`,
};

export function Link({
  href,
  children,
  variant = "default",
  external = false,
  className,
}: LinkProps) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <a href={href} className={clsx(variantStyles[variant], className)} {...externalProps}>
      {children}
    </a>
  );
}
