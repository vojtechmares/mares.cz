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
        "md:max-5xl mx-auto sm:max-w-3xl px-4 md:px-0 lg:max-w-7xl lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
