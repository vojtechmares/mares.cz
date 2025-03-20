import clsx from "clsx";
import { ReactNode } from "react";

type SectionProps = {
  children?: ReactNode;
  className?: string;
  background?: "white" | "black" | "amber";
  id?: string;
  ariaLabel?: string;
};

const baseStyles = "py-20 sm:py-32";

const backgroundStyles = {
  white: "bg-white",
  black: "bg-black",
  amber: "bg-amber-500",
};

export function Section({
  children,
  className,
  id,
  ariaLabel,
  background = "white",
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
