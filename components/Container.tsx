import clsx from "clsx";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
};

export function Container({ className, children }: Props) {
  return (
    <div
      className={clsx(
        "md:max-5xl mx-auto max-w-sm sm:max-w-3xl sm:px-4 md:px-6 lg:max-w-7xl lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
