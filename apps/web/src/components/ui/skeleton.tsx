import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Pulsing placeholder. Radius should match whatever it stands in for, so the
 * layout doesn't shift when real content arrives. Never a spinner — those are
 * reserved for the inside of a loading button.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-[pulse-soft_1.5s_ease-in-out_infinite] rounded-md bg-surface-tertiary",
        className,
      )}
      {...props}
    />
  );
}

/** Several text lines with varied widths, so it reads as prose not a block. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  const widths = ["w-full", "w-[92%]", "w-[78%]", "w-[85%]", "w-[64%]"];
  return (
    <div className={cn("flex flex-col gap-sm", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3.5 rounded-sm", widths[i % widths.length])} />
      ))}
    </div>
  );
}

/**
 * Portrait tile + caption block, matching the closet and outfit grid cards.
 * The image runs edge to edge like the real card, so nothing shifts when the
 * content lands.
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface shadow-md",
        className,
      )}
    >
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="flex flex-col gap-md p-xl">
        <Skeleton className="h-4 w-3/4 rounded-sm" />
        <Skeleton className="h-3.5 w-1/3 rounded-sm" />
        <Skeleton className="mt-1 h-7 w-20 rounded-sm" />
      </div>
    </div>
  );
}

export function SkeletonGrid({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-2xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
