/* oxlint-disable jsx-a11y/label-has-associated-control --
   Vendored shadcn primitive: htmlFor is supplied by callers via {...props}. */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// Field label per the design system (IBM Plex Sans / font-display, semibold, zinc-900).
// When paired with a checkbox (consent), it renders as normal Inter body text.
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "font-display block text-sm font-semibold text-zinc-900 select-none",
        "peer-data-[slot=checkbox]:font-sans peer-data-[slot=checkbox]:font-normal peer-data-[slot=checkbox]:text-zinc-700",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
