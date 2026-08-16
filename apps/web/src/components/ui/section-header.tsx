import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** `h2` by default; drop to `h3` when nested inside another section. */
  as?: "h2" | "h3";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  as: Heading = "h2",
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-xl flex items-end justify-between gap-lg", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-eyebrow uppercase text-text-muted">{eyebrow}</p>
        )}
        <Heading
          className={cn(
            "text-text-primary",
            Heading === "h2" ? "text-h2" : "text-h3",
          )}
        >
          {title}
        </Heading>
        {description && (
          <p className="mt-1 text-body text-text-secondary">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
