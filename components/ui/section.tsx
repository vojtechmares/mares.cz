import clsx from "clsx"
import {ReactNode} from "react"

type SectionProps = {
  children?: ReactNode
  className?: string
  background?: "white" | "black" | "amber" | "slate"
  id?: string
  ariaLabel?: string
}

const baseStyles = "py-20 sm:py-32"

const backgroundStyles = {
  white: "bg-white",
  black: "bg-black",
  amber: "bg-amber-500",
  slate: "bg-slate-50",
}

export function Section({
  children,
  className,
  id,
  ariaLabel,
  background = "slate",
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={clsx(className, backgroundStyles[background], baseStyles)}
    >
      {children}
    </section>
  )
}
