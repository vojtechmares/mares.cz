import clsx from "clsx";
import { type ReactNode } from "react";
import { spacing } from "../../lib/design-tokens";

type ContainerProps = {
  className?: string;
  children?: ReactNode;
};

const baseStyles = `mx-auto ${spacing.container} sm:max-w-3xl md:max-w-5xl md:px-0 lg:max-w-7xl`;

export function Container({ className, children }: ContainerProps) {
  return <div className={clsx(baseStyles, className)}>{children}</div>;
}
