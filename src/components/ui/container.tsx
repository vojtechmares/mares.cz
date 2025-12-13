import clsx from "clsx";
import { type ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
};

export function Container({ className, children }: Props) {
  return (
    <div
      className={clsx(
        "mx-auto px-4 sm:max-w-3xl md:max-w-5xl md:px-0 lg:max-w-7xl lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
