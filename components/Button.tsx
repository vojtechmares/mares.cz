import Link from "next/link";
import clsx from "clsx";
import { ReactNode } from "react";

const baseStyles = {
  solid:
    "group inline-flex items-center justify-center rounded-full font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
  outline:
    "group inline-flex ring-1 items-center justify-center rounded-full focus:outline-none",
};

const variantStyles = {
  solid: {
    black:
      "bg-black text-white hover:bg-slate-700 active:bg-slate-800 focus-visible:outline-slate-900",
    amber:
      "bg-amber-500 text-white hover:bg-amber-500 active:bg-amber-500 focus-visible:outline-amber-500",
    white:
      "bg-white text-black hover:bg-amber-50 active:bg-amber-500 focus-visible:outline-white",
  },
  outline: {
    black:
      "ring-slate-200 text-black hover:ring-slate-300 active:bg-slate-100 focus-visible:outline-amber-500 focus-visible:ring-slate-300",
    white:
      "ring-slate-700 text-white hover:ring-slate-500 active:ring-slate-700 focus-visible:outline-white",
    amber: "", // Outline buttons cannot be amber
  },
};

const transitionStyle = "transition duration-150 ease-in-out";

const sizeStyles = {
  medium: "px-4 py-2 text-sm",
  large: "px-8 py-4 text-base",
};

type Props = {
  variant?: "solid" | "outline";
  color?: "black" | "white" | "amber";
  size?: "medium" | "large";
  className?: string;
  href?: string;
  children?: ReactNode;
  type?: "text/html" | "application/rss+xml" | "application/atom+xml";
};

export function Button({
  variant = "solid",
  color = "black",
  size = "medium",
  type = "text/html",
  className,
  href,
  children,
}: Props) {
  if (variant === "outline" && color === "amber") {
    throw new Error("Outline buttons cannot be amber");
  }

  className = clsx(
    baseStyles[variant],
    variantStyles[variant][color],
    sizeStyles[size],
    transitionStyle,
    className,
  );

  if (href !== undefined) {
    return (
      <Link type={type} href={href} className={className}>
        {children}
      </Link>
    );
  } else {
    return <button className={className}>{children}</button>;
  }
}
