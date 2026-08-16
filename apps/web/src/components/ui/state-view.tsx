import * as React from "react";
import { cn } from "@/lib/utils";

export interface StateViewProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "empty" | "error";
  className?: string;
}

/**
 * Centred empty/error state. Same skeleton for both so a failed load and an
 * unpopulated section read as deliberate rather than broken.
 */
export function StateView({
  icon,
  title,
  description,
  action,
  tone = "empty",
  className,
}: StateViewProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-lg py-6xl text-center",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mb-xl inline-flex items-center justify-center [&>svg]:size-16 [&>svg]:stroke-[1.25]",
          tone === "error" ? "text-danger" : "text-text-muted",
        )}
      >
        {icon}
      </span>
      <h3 className="text-h3 text-text-primary">{title}</h3>
      {description && (
        <p className="mt-sm max-w-[400px] text-body text-text-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-2xl">{action}</div>}
    </div>
  );
}
