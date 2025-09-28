import clsx from "clsx";
import { type ReactNode } from "react";

type HeadingProps = {
    children?: ReactNode;
    className?: string;
    level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    ariaLabel?: string;
    text?: "black" | "white" | "amber";
    id?: string;
};

const baseStyles = "font-display tracking-tight";

const levelStyles = {
    h1: "text-4xl sm:text-5xl font-bold",
    h2: "text-3xl sm:text-4xl font-bold",
    h3: "text-2xl sm:text-3xl font-medium",
};

const textStyles = {
    black: "text-black",
    white: "text-white",
    amber: "text-amber-500",
};

export function Heading({
    children,
    className,
    level = "h1",
    text = "black",
    id = undefined,
    ariaLabel,
}: HeadingProps) {
    if (level === "h4" || level === "h5" || level === "h6") {
        throw new Error("Headings must be level 1, 2, or 3");
    }

    const Tag = level;

    return (
        <Tag
            className={clsx(
                className,
                levelStyles[level],
                textStyles[text],
                baseStyles
            )}
            aria-label={ariaLabel}
            id={id}
        >
            {children}
        </Tag>
    );
}
