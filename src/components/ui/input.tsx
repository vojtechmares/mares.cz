import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

// Styled per the mares.cz design system input spec (bordered, sharp corners).
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full min-w-0 rounded-none border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 transition-colors outline-none placeholder:text-neutral-400 focus:border-neutral-500 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-50 aria-invalid:border-2 aria-invalid:border-red-500 aria-invalid:bg-red-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
