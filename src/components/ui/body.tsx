import clsx from "clsx";
import { type ReactNode } from "react";
import { typography, colors, type BodySize } from "../../lib/design-tokens";

type BodyColor = "primary" | "secondary" | "muted" | "inverse";
type BodyElement = "p" | "span" | "div";

type BodyProps = {
  children?: ReactNode;
  className?: string;
  variant?: BodySize;
  color?: BodyColor;
  as?: BodyElement;
};

const colorStyles: Record<BodyColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  muted: colors.text.muted,
  inverse: colors.text.inverse,
};

export function Body({
  children,
  className,
  variant = "base",
  color = "primary",
  as: Tag = "p",
}: BodyProps) {
  return (
    <Tag
      className={clsx(typography.body[variant], colorStyles[color], className)}
    >
      {children}
    </Tag>
  );
}
