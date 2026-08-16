import * as React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Stand-in for a selfie in mock history entries.
 *
 * Real uploads render the user's own file; these are for seeded ratings where
 * no photo exists. The wash is derived from the id so each entry looks
 * distinct rather than a wall of identical tiles.
 */
const WASHES = [
  ["#f6dbc7", "#c9a476"],
  ["#e7e2d9", "#b3a48d"],
  ["#e8a878", "#c1622d"],
  ["#ddd6ca", "#9a9186"],
  ["#fbeee6", "#e0b58e"],
];

export function PersonPhoto({
  seed,
  className,
  iconClassName,
}: {
  seed: string;
  className?: string;
  iconClassName?: string;
}) {
  const sum = [...seed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const [from, to] = WASHES[sum % WASHES.length];

  return (
    <div
      role="img"
      aria-label="Outfit photo"
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-surface-secondary",
        className,
      )}
      style={{ backgroundImage: `linear-gradient(150deg, ${from} 0%, ${to} 100%)` }}
    >
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(160deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.12) 100%)",
        }}
      />
      <User
        aria-hidden
        className={cn("relative stroke-[1] text-[#1a1917]/25", iconClassName ?? "size-12")}
      />
    </div>
  );
}
