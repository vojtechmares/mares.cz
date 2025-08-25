import clsx from "clsx";
import { type ReactNode } from "react";

type TextProps = {
    children?: ReactNode;
    className?: string;
    text?: "black" | "white" | "slate";
};

const textStyles = {
    black: "text-black",
    white: "text-white",
    slate: "text-slate-300",
};

export function Text({ children, className, text = "black" }: TextProps) {
    return <p className={clsx(className, textStyles[text])}>{children}</p>;
}
