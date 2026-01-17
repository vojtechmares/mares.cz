import clsx from "clsx";
import { type ReactNode } from "react";
import { spacing } from "../../lib/design-tokens";

type ContainerProps = {
  className?: string;
  children?: ReactNode;
};

// Standard container: 1280px max width with responsive padding
const baseStyles = `mx-auto ${spacing.container} ${spacing.maxWidth.standard}`;

export function Container({ className, children }: ContainerProps) {
  return <div className={clsx(baseStyles, className)}>{children}</div>;
}
