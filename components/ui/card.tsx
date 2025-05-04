import clsx from "clsx"
import {ReactNode} from "react"

type CardProps = {
  children?: ReactNode
  background?: "white" | "black" | "amber" | "slate" | "amber-light"
  className?: string
  border?: "none" // TODO: Add more border options
  shadow?: boolean
}

const backgroundStyles = {
  white: "bg-white",
  black: "bg-black",
  amber: "bg-amber-500",
  slate: "bg-slate-50",
  "amber-light": "bg-amber-100",
}

const borderStyles = {
  none: "border-none",
}

const baseStyles = "overflow-hidden rounded-3xl px-4 py-8 sm:px-8"

export function Card({
  children,
  className,
  background = "slate",
  border = "none",
  shadow = false,
}: CardProps) {
  return (
    <section
      className={clsx(
        backgroundStyles[background],
        borderStyles[border],
        baseStyles,
        shadow ? "shadow" : "",
        className,
      )}
    >
      {children}
    </section>
  )
}
