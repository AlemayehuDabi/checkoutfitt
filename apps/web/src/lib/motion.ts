import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion presets, per docs/design-system.md §7.
 *
 * Components spread these rather than hand-rolling durations, so timing stays
 * consistent across the app. Anything animating a shadow uses a literal value
 * instead of `var(--shadow-lg)` — Framer Motion interpolates the property
 * itself and cannot animate through a CSS custom property.
 */

const standard: Transition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] };

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.25 },
};

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
};

export const slideInRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.3 },
};

/** Parent list variant — children stagger in when combined with `listItem`. */
export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

export const listItem: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const SHADOW_MD =
  "0 2px 8px rgba(26, 25, 23, 0.08), 0 1px 3px rgba(26, 25, 23, 0.04)";
export const SHADOW_LG =
  "0 4px 16px rgba(26, 25, 23, 0.10), 0 2px 4px rgba(26, 25, 23, 0.04)";
export const SHADOW_PRIMARY = "0 4px 14px rgba(193, 98, 45, 0.25)";

/** Interactive card: lifts 3px and deepens its shadow on hover. */
export const cardHover = {
  whileHover: { y: -3, boxShadow: SHADOW_LG },
  transition: standard,
};

export const buttonPress = {
  whileTap: { scale: 0.97 },
  transition: { duration: 0.1 },
};

export const scoreCountUp: Transition = { duration: 1.2, ease: "easeOut" };
