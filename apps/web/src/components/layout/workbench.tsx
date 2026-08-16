"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Two-pane layout for the input → result tools (shopping, capsule, travel,
 * inspiration).
 *
 * The mobile pattern was sequential: fill a form, the form disappears, the
 * result replaces it. On a desktop there's room to keep the controls visible
 * beside the output, so you can adjust and re-run without navigating back.
 * The panel sticks while results scroll; below `lg` it stacks, controls first.
 */
export function Workbench({
  panel,
  children,
  panelClassName,
}: {
  panel: React.ReactNode;
  children: React.ReactNode;
  panelClassName?: string;
}) {
  return (
    <div className="mx-auto grid max-w-[1200px] items-start gap-2xl py-2xl lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-4xl">
      <aside
        className={cn(
          "rounded-xl border border-border bg-surface p-xl shadow-md lg:sticky lg:top-24",
          panelClassName,
        )}
      >
        {panel}
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Placeholder shown in the results pane before anything has been run. */
export function WorkbenchIdle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/50 px-lg py-6xl text-center">
      <span
        aria-hidden
        className="mb-xl inline-flex text-text-muted [&>svg]:size-14 [&>svg]:stroke-[1.25]"
      >
        {icon}
      </span>
      <h3 className="text-h3 text-text-primary">{title}</h3>
      <p className="mt-sm max-w-[42ch] text-body text-text-muted">{description}</p>
    </div>
  );
}

/** Fades results in as they replace the idle or loading state. */
export function WorkbenchResult({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
