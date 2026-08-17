"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string> {
  value: T;
  label: React.ReactNode;
  /** Rendered left of the label; pass a sized lucide icon. */
  icon?: React.ReactNode;
  /** Screen-reader name when the visible label is an icon alone. */
  srLabel?: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the group. */
  label: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Two-to-four mutually exclusive options, all visible at once.
 *
 * The web answer to a row of choice cards: a dropdown hides the options behind
 * a click and a stack of cards spends a whole column on three words. Above
 * roughly four options this stops working — use Select instead.
 *
 * The active indicator is a shared `layoutId`, so switching slides rather than
 * cutting, which is what makes it read as one control instead of buttons.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  className,
}: SegmentedControlProps<T>) {
  const reduce = useReducedMotion();
  const groupId = React.useId();

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface-secondary p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={option.srLabel}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative inline-flex cursor-pointer items-center justify-center gap-sm rounded-full whitespace-nowrap",
              "transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
              size === "sm" ? "h-8 px-lg text-tag" : "h-10 px-xl text-body-medium",
              // Icon-only segments stay square rather than stretching wide.
              !option.label && (size === "sm" ? "w-8 px-0" : "w-10 px-0"),
              active
                ? "text-text-primary"
                : "text-text-muted hover:text-text-primary",
            )}
          >
            {active && (
              <motion.span
                aria-hidden
                layoutId={`segmented-${groupId}`}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
                }
                className="absolute inset-0 rounded-full bg-surface shadow-sm"
              />
            )}
            <span className="relative inline-flex items-center gap-sm [&>svg]:size-[18px]">
              {option.icon}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
