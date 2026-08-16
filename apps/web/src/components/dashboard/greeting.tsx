"use client";

import * as React from "react";
import { formatLongDate, greetingFor } from "@/lib/utils";
import { useIsClient } from "@/lib/use-is-client";

/**
 * "Good morning" depends on the reader's clock, which the server doesn't
 * know. Rendering it server-side would either bake in build-time or produce a
 * hydration mismatch, so the server emits a neutral greeting and the
 * time-aware one swaps in after hydration — a legitimate server/client split
 * via useSyncExternalStore rather than a suppressed warning.
 */
export function Greeting({ name }: { name: string }) {
  const isClient = useIsClient();
  const now = new Date();
  const firstName = name.split(" ")[0];

  return (
    <div>
      <p className="text-caption text-text-muted">
        {isClient ? formatLongDate(now) : " "}
      </p>
      <h2 className="mt-1 text-h1 text-text-primary text-balance">
        {isClient ? `${greetingFor(now)}, ${firstName}` : `Welcome back, ${firstName}`}
      </h2>
    </div>
  );
}
