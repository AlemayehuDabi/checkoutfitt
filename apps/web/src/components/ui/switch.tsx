"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Visible label. Omit only when an aria-label is supplied instead. */
  label?: React.ReactNode;
  description?: React.ReactNode;
  "aria-label"?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Boolean toggle for settings and filters.
 *
 * A switch, not a checkbox: it applies immediately rather than being staged
 * and submitted. `role="switch"` is what tells a screen reader that apart from
 * a checkbox — the visual pill alone doesn't communicate it.
 */
export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
  ...aria
}: SwitchProps) {
  const reduce = useReducedMotion();
  const id = React.useId();

  const control = (
    <button
      type="button"
      role="switch"
      id={label ? id : undefined}
      aria-checked={checked}
      aria-label={aria["aria-label"]}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5",
        "transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer",
        checked
          ? "bg-primary-500"
          : "bg-surface-tertiary hover:bg-border-strong",
      )}
    >
      <motion.span
        aria-hidden
        layout={!reduce}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "block size-5 rounded-full bg-surface shadow-sm",
          // Without layout animation the knob still has to land in the right
          // place, so position is expressed in the class too.
          checked ? "ml-auto" : "mr-auto",
        )}
      />
    </button>
  );

  if (!label) return <span className={className}>{control}</span>;

  return (
    <div className={cn("flex items-start justify-between gap-lg", className)}>
      <span className="min-w-0">
        <label
          htmlFor={id}
          className={cn(
            "block text-body-medium text-text-primary",
            !disabled && "cursor-pointer",
          )}
        >
          {label}
        </label>
        {description && (
          <span className="mt-0.5 block text-caption text-text-muted">
            {description}
          </span>
        )}
      </span>
      {control}
    </div>
  );
}
