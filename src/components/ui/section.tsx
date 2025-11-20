import clsx from "clsx";
import { type ReactNode } from "react";

type SectionProps = {
  children?: ReactNode;
  className?: string;
  background?: "white" | "black" | "amber" | "zinc";
  id?: string;
  ariaLabel?: string;
};

const baseStyles = "py-20 sm:py-32";

const backgroundStyles = {
  white: "bg-white",
  black: "bg-zinc-900",
  amber: "bg-amber-500",
  zinc: "bg-zinc-50",
};

export function Section({
  children,
  className,
  id,
  ariaLabel,
  background = "zinc",
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={clsx(className, backgroundStyles[background], baseStyles)}
    >
      {children}
    </section>
  );
}
