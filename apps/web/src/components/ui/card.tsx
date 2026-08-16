"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { SHADOW_LG } from "@/lib/motion";

type CardVariant = "standard" | "hero" | "flat";

const VARIANTS: Record<CardVariant, string> = {
  standard: "bg-surface border border-border rounded-xl p-xl shadow-md",
  hero: "bg-surface border border-border rounded-xl p-2xl shadow-lg",
  // Embedded inside another card or section: no border, no shadow.
  flat: "bg-surface-secondary rounded-md p-lg",
};

export interface CardProps extends HTMLMotionProps<"div"> {
  variant?: CardVariant;
  /** Adds pointer affordance, hover lift, and a focus ring. */
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "standard", interactive = false, className, children, ...props },
  ref,
) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      whileHover={
        interactive && !reduce ? { y: -3, boxShadow: SHADOW_LG } : undefined
      }
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        VARIANTS[variant],
        interactive &&
          "cursor-pointer transition-colors duration-200 hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-lg flex items-start justify-between gap-lg", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-h3 text-text-primary", className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-body text-text-secondary", className)} {...props} />
  );
}
