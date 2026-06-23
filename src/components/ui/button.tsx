import clsx from "clsx";
import { type ReactNode } from "react";

import { colors, radius } from "../../lib/design-tokens";

type ButtonStyle = "solid" | "outline";
type ButtonVariant = "primary" | "secondary" | "accent";
type ButtonSize = "medium" | "large";

const baseStyles: Record<ButtonStyle, string> = {
  solid: `group inline-flex items-center justify-center ${radius.full} font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2`,
  outline: `group inline-flex ring-1 items-center justify-center ${radius.full} focus:outline-hidden`,
};

const styleVariants: Record<ButtonStyle, Record<ButtonVariant, string>> = {
  solid: {
    primary: `${colors.background.inverse} ${colors.text.inverse} hover:bg-neutral-700 active:bg-neutral-800 focus-visible:outline-neutral-900`,
    accent: `${colors.accent.default} ${colors.accent.hover} active:bg-orange-500 focus-visible:outline-orange-500`,
    secondary: `${colors.background.default} ${colors.text.primary} hover:bg-orange-50 active:bg-orange-500 focus-visible:outline-white`,
  },
  outline: {
    primary: `${colors.border.default} ${colors.text.primary} hover:ring-neutral-300 active:bg-neutral-100 focus-visible:outline-orange-500 focus-visible:ring-neutral-300`,
    secondary: `ring-neutral-700 ${colors.text.inverse} hover:ring-neutral-500 active:ring-neutral-700 focus-visible:outline-white`,
    accent: "", // Outline buttons cannot be accent
  },
};

const transitionStyle = "transition duration-150 ease-in-out font-mono";

const sizeStyles: Record<ButtonSize, string> = {
  medium: "px-4 py-2 text-sm",
  large: "px-8 py-4 text-base",
};

type ButtonProps = {
  style?: ButtonStyle;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  href?: string;
  children?: ReactNode;
  type?: "text/html" | "application/rss+xml" | "application/atom+xml";
  onClick?: () => void;
};

export function Button({
  style = "solid",
  variant = "primary",
  size = "large",
  type = "text/html",
  className,
  href,
  children,
  onClick,
}: ButtonProps) {
  if (style === "outline" && variant === "accent") {
    throw new Error("Outline buttons cannot be accent");
  }

  const combinedClassName = clsx(
    baseStyles[style],
    styleVariants[style][variant],
    sizeStyles[size],
    transitionStyle,
    className,
  );

  if (href !== undefined) {
    return (
      <a type={type} href={href} className={combinedClassName}>
        {children}
      </a>
    );
  } else {
    return (
      <button className={combinedClassName} onClick={onClick}>
        {children}
      </button>
    );
  }
}
