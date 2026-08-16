"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_CAPSULE_SIZE, MIN_CAPSULE_SIZE } from "@/lib/mock-data";

/**
 * Stepper rather than a range input: the useful span is 5–20, so every value
 * matters and a precise ±1 control beats dragging. The track underneath still
 * shows where you are in the range.
 */
export function SizeStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  const pct =
    ((value - MIN_CAPSULE_SIZE) / (MAX_CAPSULE_SIZE - MIN_CAPSULE_SIZE)) * 100;

  function clamp(next: number) {
    onChange(Math.min(MAX_CAPSULE_SIZE, Math.max(MIN_CAPSULE_SIZE, next)));
  }

  return (
    <div>
      <div className="flex items-center gap-lg">
        <button
          type="button"
          onClick={() => clamp(value - 1)}
          disabled={value <= MIN_CAPSULE_SIZE}
          aria-label="One fewer item"
          className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus aria-hidden className="size-4" />
        </button>

        <div
          role="spinbutton"
          aria-valuenow={value}
          aria-valuemin={MIN_CAPSULE_SIZE}
          aria-valuemax={MAX_CAPSULE_SIZE}
          aria-label="Items in capsule"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowRight") {
              e.preventDefault();
              clamp(value + 1);
            }
            if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
              e.preventDefault();
              clamp(value - 1);
            }
          }}
          className="min-w-[92px] rounded-md text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span className="text-stat text-text-primary tabular-nums">{value}</span>
          <span className="mt-0.5 block text-caption text-text-muted">pieces</span>
        </div>

        <button
          type="button"
          onClick={() => clamp(value + 1)}
          disabled={value >= MAX_CAPSULE_SIZE}
          aria-label="One more item"
          className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus aria-hidden className="size-4" />
        </button>
      </div>

      <div className="mt-lg h-1.5 w-full max-w-[280px] overflow-hidden rounded-full bg-surface-tertiary">
        <div
          className={cn("h-full rounded-full bg-primary-500 transition-[width] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-sm text-caption text-text-muted tabular-nums">
        {MIN_CAPSULE_SIZE}–{MAX_CAPSULE_SIZE} pieces
      </p>
    </div>
  );
}
