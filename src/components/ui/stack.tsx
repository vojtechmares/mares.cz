import clsx from "clsx";
import { type ReactNode } from "react";
import { spacing, type GapSize } from "../../lib/design-tokens";

type StackDirection = "vertical" | "horizontal";
type StackAlign = "start" | "center" | "end" | "stretch";
type StackJustify = "start" | "center" | "end" | "between" | "around";

type StackProps = {
  children: ReactNode;
  direction?: StackDirection;
  gap?: GapSize;
  align?: StackAlign;
  justify?: StackJustify;
  className?: string;
};

const directionStyles: Record<StackDirection, string> = {
  vertical: "flex flex-col",
  horizontal: "flex flex-row",
};

const alignStyles: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyStyles: Record<StackJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export function Stack({
  children,
  direction = "vertical",
  gap = "md",
  align,
  justify,
  className,
}: StackProps) {
  return (
    <div
      className={clsx(
        directionStyles[direction],
        spacing.gap[gap],
        align && alignStyles[align],
        justify && justifyStyles[justify],
        className,
      )}
    >
      {children}
    </div>
  );
}
