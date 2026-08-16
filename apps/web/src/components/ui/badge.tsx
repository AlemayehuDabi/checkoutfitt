import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-surface-secondary text-text-secondary",
  primary: "bg-primary-50 text-primary-500",
  success: "bg-success-light text-success",
  danger: "bg-danger-light text-danger",
  warning: "bg-warning-light text-warning-strong",
  info: "bg-info-light text-info",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: React.ReactNode;
}

export function Badge({
  tone = "neutral",
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-tag font-[500]",
        TONES[tone],
        className,
      )}
      {...props}
    >
      {icon && <span aria-hidden className="[&>svg]:size-3.5">{icon}</span>}
      {children}
    </span>
  );
}

/** Small numeric counter, e.g. unread notifications. */
export function CountBadge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full bg-primary-500 px-1.5 text-[11px] font-[600] text-text-on-primary tabular-nums",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

/** Promotional ribbon — uppercase, tracked, filled. */
export function PromoBadge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-primary-500 px-2.5 py-1 text-eyebrow uppercase text-text-on-primary",
        className,
      )}
    >
      {children}
    </span>
  );
}
