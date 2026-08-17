"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PopoverProps {
  /** Rendered inside the trigger button — pass the visible control content. */
  trigger: React.ReactNode;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  align?: "start" | "end";
  /** Accessible name for the trigger. */
  label: string;
  triggerClassName?: string;
  className?: string;
}

/**
 * Contextual panel anchored to a trigger — filter controls, swatch detail,
 * anything richer than a menu of commands.
 *
 * Distinct from Dropdown, which is a `role="menu"` of one-shot actions and
 * closes as soon as you pick one. A Popover holds interactive content, so it
 * stays open until dismissed and exposes `close` to its children for the cases
 * where an action should dismiss it.
 */
export function Popover({
  trigger,
  children,
  align = "start",
  label,
  triggerClassName,
  className,
}: PopoverProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Focus has to come back to the trigger, or Escape strands the keyboard
      // user at the top of the document.
      triggerRef.current?.focus();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = React.useCallback(() => setOpen(false), []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className={cn("cursor-pointer", triggerClassName)}
      >
        {trigger}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label={label}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: align === "end" ? "top right" : "top left" }}
            className={cn(
              "absolute top-[calc(100%+8px)] z-50 w-[280px] rounded-lg border border-border bg-surface p-xl shadow-lg",
              align === "end" ? "right-0" : "left-0",
              className,
            )}
          >
            {typeof children === "function" ? children(close) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
