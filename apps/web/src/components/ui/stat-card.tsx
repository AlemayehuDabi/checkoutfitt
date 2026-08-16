import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  value: React.ReactNode;
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  className?: string;
  /** `flat` for stats grouped inside a parent card. */
  variant?: "standard" | "flat";
}

export function StatCard({
  value,
  label,
  icon,
  hint,
  className,
  variant = "standard",
}: StatCardProps) {
  return (
    <div
      className={cn(
        variant === "standard"
          ? "rounded-xl border border-border bg-surface p-xl shadow-md"
          : "rounded-md bg-surface-secondary p-lg",
        className,
      )}
    >
      {icon && (
        <span aria-hidden className="mb-md inline-flex text-primary-500 [&>svg]:size-5">
          {icon}
        </span>
      )}
      <p className="text-stat text-text-primary tabular-nums">{value}</p>
      <p className="mt-1 text-caption uppercase tracking-[0.06em] text-text-muted">
        {label}
      </p>
      {hint && <p className="mt-sm text-sm text-text-secondary">{hint}</p>}
    </div>
  );
}
