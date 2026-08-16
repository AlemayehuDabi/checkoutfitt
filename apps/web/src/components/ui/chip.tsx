"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: React.ReactNode;
}

/** Selectable pill. Uses aria-pressed so screen readers announce the toggle. */
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  function Chip({ selected = false, icon, className, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-sm rounded-full px-lg text-tag whitespace-nowrap",
          "transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
          selected
            ? "border-[1.5px] border-primary-500 bg-primary-50 font-[600] text-primary-500"
            : "border border-border bg-transparent text-text-primary hover:border-border-strong hover:bg-surface-secondary",
          className,
        )}
        {...props}
      >
        {icon && <span aria-hidden className="[&>svg]:size-4">{icon}</span>}
        {children}
      </button>
    );
  },
);

/** Static, non-interactive metadata tag. */
export function Tag({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-sm bg-surface-secondary px-2.5 text-tag text-text-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
