"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tracks a media query from JS. Only for cases where the *behaviour* changes
 * with viewport — a component that animates in from a different direction, for
 * instance. Anything purely visual belongs in a Tailwind breakpoint instead.
 *
 * Subscribing through `useSyncExternalStore` keeps the server snapshot honest
 * (`false`, since there's no viewport to measure) without a setState in an
 * effect.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** The `lg` breakpoint — where the shell switches to its desktop layout. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
