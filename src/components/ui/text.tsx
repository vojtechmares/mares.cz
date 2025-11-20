import clsx from "clsx";
import { type ReactNode } from "react";

type TextProps = {
  children?: ReactNode;
  className?: string;
  text?: "black" | "white" | "zinc";
};

const textStyles = {
  black: "text-zinc-900",
  white: "text-white",
  zinc: "text-zinc-300",
};

export function Text({ children, className, text = "black" }: TextProps) {
  return <p className={clsx(className, textStyles[text])}>{children}</p>;
}
