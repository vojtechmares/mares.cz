import clsx from "clsx";
import { type ReactNode } from "react";

type IconSize = "sm" | "md" | "lg";

type IconProps = {
  children: ReactNode;
  size?: IconSize;
  className?: string;
  label?: string;
};

const sizeStyles: Record<IconSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Icon({ children, size = "md", className, label }: IconProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center",
        sizeStyles[size],
        className,
      )}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {children}
    </span>
  );
}
