import * as React from "react";
import { cn } from "@/lib/utils";

export function Divider({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  if (!label) {
    return <hr className={cn("border-0 border-t border-border", className)} />;
  }

  return (
    <div className={cn("flex items-center gap-lg", className)}>
      <span className="h-px flex-1 bg-border" />
      <span className="text-caption text-text-muted">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
