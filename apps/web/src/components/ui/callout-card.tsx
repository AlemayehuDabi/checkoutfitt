import * as React from "react";
import { cn } from "@/lib/utils";

export interface CalloutCardProps {
  icon: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  /** `strong` uses primary-100 for the higher-emphasis variant. */
  emphasis?: "soft" | "strong";
  className?: string;
}

/**
 * Tinted advisory block — "why this outfit", pro tips, stylist notes.
 * No border, no shadow; the tint alone separates it from the card it sits in.
 */
export function CalloutCard({
  icon,
  title,
  children,
  emphasis = "soft",
  className,
}: CalloutCardProps) {
  return (
    <div
      className={cn(
        "flex gap-md rounded-md px-xl py-lg",
        emphasis === "strong" ? "bg-primary-100" : "bg-primary-50",
        className,
      )}
    >
      <span
        aria-hidden
        className="mt-0.5 shrink-0 text-primary-500 [&>svg]:size-5"
      >
        {icon}
      </span>
      <div className="min-w-0">
        {title && (
          <p className="text-body-semibold text-text-primary">{title}</p>
        )}
        <div className={cn("text-body text-text-secondary", title && "mt-1")}>
          {children}
        </div>
      </div>
    </div>
  );
}
