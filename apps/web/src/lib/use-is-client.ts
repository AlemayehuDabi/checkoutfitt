"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during SSR, true once hydrated — for portals, which need a real
 * `document`. `useSyncExternalStore` gives the server/client split directly,
 * avoiding the setState-in-effect pattern that triggers cascading renders.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
