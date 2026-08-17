"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
  /** Accessible name for the trigger wrapper. */
  label: string;
  triggerClassName?: string;
}

/**
 * Generic popover menu used by the top bar avatar and card overflow menus.
 * Closes on outside click and Escape; items are supplied as DropdownItem.
 */
export function Dropdown({
  trigger,
  children,
  align = "end",
  className,
  label,
  triggerClassName,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex cursor-pointer items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
          triggerClassName,
        )}
      >
        {trigger}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: align === "end" ? "top right" : "top left" }}
            onClick={() => setOpen(false)}
            className={cn(
              "absolute top-[calc(100%+8px)] z-50 min-w-[200px] rounded-md border border-border bg-surface p-1 shadow-lg",
              align === "end" ? "right-0" : "left-0",
              className,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type DropdownItemProps = {
  icon?: React.ReactNode;
  danger?: boolean;
  className?: string;
  children: React.ReactNode;
  /** Renders an anchor instead of a button. */
  href?: string;
  onSelect?: () => void;
};

/**
 * A menu row. Pass `href` for navigation and it renders a real link — callers
 * must not wrap this in their own `<Link>`, since an anchor around a button is
 * invalid HTML and breaks keyboard activation.
 */
export function DropdownItem({
  icon,
  danger = false,
  className,
  children,
  href,
  onSelect,
}: DropdownItemProps) {
  const classes = cn(
    "flex h-10 w-full cursor-pointer items-center gap-md rounded-sm px-md text-left text-body transition-colors duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500",
    danger
      ? "text-danger hover:bg-danger-light"
      : "text-text-primary hover:bg-surface-secondary",
    className,
  );

  const inner = (
    <>
      {icon && (
        <span aria-hidden className="shrink-0 [&>svg]:size-[18px]">{icon}</span>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} role="menuitem" onClick={onSelect} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" role="menuitem" onClick={onSelect} className={classes}>
      {inner}
    </button>
  );
}

export function DropdownSeparator() {
  return <div role="separator" className="my-1 h-px bg-border" />;
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-md pt-2 pb-1 text-eyebrow uppercase text-text-muted">
      {children}
    </p>
  );
}
