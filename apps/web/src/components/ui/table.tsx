"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Table primitives per docs/design-system.md §8.13.
 *
 * Desktop-only by design: below `md` a table forces horizontal scrolling and
 * shrinks every cell past readability, so callers render a card list instead
 * and hide this with `hidden md:block`.
 */
export function Table({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface shadow-md",
        className,
      )}
    >
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-surface-secondary">{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export type SortDirection = "asc" | "desc";

export function TH({
  children,
  align = "left",
  sortable = false,
  active = false,
  direction = "asc",
  onSort,
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  sortable?: boolean;
  active?: boolean;
  direction?: SortDirection;
  onSort?: () => void;
  className?: string;
}) {
  const label = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-caption uppercase tracking-[0.06em]",
        active ? "text-text-primary" : "text-text-muted",
      )}
    >
      {align === "right" && sortable && <SortGlyph active={active} direction={direction} />}
      {children}
      {align === "left" && sortable && <SortGlyph active={active} direction={direction} />}
    </span>
  );

  return (
    <th
      scope="col"
      // Communicates sort state to assistive tech, not just the arrow glyph.
      aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : undefined}
      className={cn(
        "h-11 border-b border-border-strong px-lg font-[600]",
        align === "right" && "text-right",
        className,
      )}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "inline-flex cursor-pointer items-center rounded-sm transition-colors hover:text-text-primary",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
          )}
        >
          {label}
        </button>
      ) : (
        label
      )}
    </th>
  );
}

function SortGlyph({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  if (!active) {
    return <ChevronsUpDown aria-hidden className="size-3.5 opacity-60" />;
  }
  return direction === "asc" ? (
    <ArrowUp aria-hidden className="size-3.5" />
  ) : (
    <ArrowDown aria-hidden className="size-3.5" />
  );
}

/**
 * A row that navigates on click.
 *
 * The click is a pointer convenience only — callers must still put a real link
 * in one cell so the row is reachable by keyboard. `focus-within` mirrors the
 * hover treatment when that link takes focus.
 */
export function TR({
  children,
  interactive = false,
  className,
  onClick,
}: {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-border last:border-b-0",
        interactive &&
          "cursor-pointer transition-colors duration-200 hover:bg-[color:var(--color-overlay-light)] focus-within:bg-[color:var(--color-overlay-light)]",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TD({
  children,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td
      className={cn(
        "h-14 px-lg text-body text-text-secondary",
        align === "right" && "text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}
