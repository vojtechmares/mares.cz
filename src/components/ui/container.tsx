import clsx from "clsx";
import { type ReactNode } from "react";

import { spacing } from "../../lib/design-tokens";

type ContainerMode = "default" | "prose";

type ContainerProps = {
  className?: string;
  children?: ReactNode;
  mode?: ContainerMode;
};

const modeStyles: Record<ContainerMode, string> = {
  default: spacing.maxWidth.standard,
  prose: `${spacing.maxWidth.prose} md:text-lg lg:text-xl`,
};

export function Container({ className, children, mode = "default" }: ContainerProps) {
  return <div className={clsx("mx-auto", spacing.container, modeStyles[mode], className)}>{children}</div>;
}
