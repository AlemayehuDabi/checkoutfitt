"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarPlus, StickyNote, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { longDate } from "@/lib/calendar";
import { useIsDesktop } from "@/lib/use-media-query";
import { CONTEXT_LABELS, type MockSchedule } from "@/lib/mock-data";
import { Button, IconButton } from "@/components/ui/button";
import { StateView } from "@/components/ui/state-view";
import { OutfitImage } from "@/components/outfit-image";

/**
 * Day detail. A right-hand slide-over on desktop (per §8.8 — a panel, not a
 * modal, so the calendar stays visible while you plan), and a centered modal
 * below `lg`, where a side panel would leave no room for the grid.
 *
 * The two enter from different directions, which is behaviour rather than
 * styling, so the breakpoint is read in JS rather than expressed in classes.
 */
export function DayPanel({
  dateKey,
  schedule,
  onClose,
  onAssign,
  onRemove,
}: {
  dateKey: string | null;
  schedule: MockSchedule | undefined;
  onClose: () => void;
  onAssign: () => void;
  onRemove: () => void;
}) {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  React.useEffect(() => {
    if (!dateKey) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dateKey, onClose]);

  return (
    <AnimatePresence>
      {dateKey && (
        <>
          {/* Scrim only below lg — on desktop the calendar stays interactive. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-overlay lg:hidden"
          />

          {/* Positioning lives on the wrapper: Framer writes an inline
              `transform` on the panel, which would override translate-based
              centering classes. The wrapper ignores pointer events so the
              desktop calendar stays clickable beside the slide-over. */}
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-lg lg:items-stretch lg:justify-end lg:p-0">
            <motion.aside
              role="dialog"
              aria-modal={isDesktop ? "false" : "true"}
              aria-label={`Plan for ${longDate(dateKey)}`}
              initial={
                reduce
                  ? { opacity: 0 }
                  : isDesktop
                    ? { opacity: 0, x: 40 }
                    : { opacity: 0, scale: 0.96 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : isDesktop
                    ? { opacity: 0, x: 40 }
                    : { opacity: 0, scale: 0.96 }
              }
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                // Below lg: a centered modal, capped so it never fills the screen.
                "pointer-events-auto max-h-[85dvh] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-border bg-surface shadow-xl",
                // lg and up: a full-height slide-over pinned to the right edge.
                "lg:h-full lg:max-h-none lg:w-[420px] lg:max-w-none lg:rounded-none lg:rounded-l-2xl lg:border-y-0 lg:border-r-0",
              )}
            >
              <div className="sticky top-0 flex items-start justify-between gap-lg border-b border-border bg-surface px-2xl py-xl">
                <div className="min-w-0">
                  <p className="text-eyebrow uppercase text-text-muted">Planned for</p>
                  <h2 className="mt-1 text-h3 text-text-primary text-balance">
                    {longDate(dateKey)}
                  </h2>
                </div>
                <IconButton label="Close panel" size="sm" onClick={onClose}>
                  <X aria-hidden className="size-[18px]" />
                </IconButton>
              </div>

              <div className="p-2xl">
                {schedule ? (
                  <>
                    <Link
                      href={`/dashboard/outfits/${schedule.outfit.id}`}
                      className="group block overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                      <div className="overflow-hidden">
                        <OutfitImage
                          items={schedule.outfit.items}
                          variant="hero"
                          className="h-44 w-full transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-lg">
                        <p className="text-eyebrow uppercase text-primary-500">
                          {CONTEXT_LABELS[schedule.outfit.context]}
                        </p>
                        <p className="mt-1 text-body-semibold text-text-primary">
                          {schedule.outfit.items.length} pieces
                        </p>
                        <span className="mt-md inline-flex items-center gap-1.5 text-body-medium text-primary-500">
                          See the look
                          <ArrowRight
                            aria-hidden
                            className="size-4 transition-transform group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </Link>

                    <ul className="mt-xl flex flex-col gap-sm">
                      {schedule.outfit.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-md rounded-md bg-surface-secondary px-md py-2"
                        >
                          <span className="truncate text-sm text-text-primary">
                            {item.category}
                          </span>
                          <span className="shrink-0 text-caption text-text-muted">
                            {item.color}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {schedule.notes && (
                      <div className="mt-xl flex gap-md rounded-md bg-primary-50 px-lg py-md">
                        <StickyNote
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-primary-500"
                        />
                        <p className="text-body text-text-secondary">
                          {schedule.notes}
                        </p>
                      </div>
                    )}

                    <div className="mt-2xl flex flex-wrap gap-md">
                      <Button variant="secondary" onClick={onAssign}>
                        Change outfit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={onRemove}
                        iconLeft={<Trash2 className="size-4" />}
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <StateView
                    icon={<CalendarPlus />}
                    title="Nothing planned"
                    description="Pick one of your saved outfits for this day."
                    className="py-3xl"
                    action={
                      <Button
                        onClick={onAssign}
                        iconLeft={<CalendarPlus className="size-4" />}
                      >
                        Assign an outfit
                      </Button>
                    }
                  />
                )}
              </div>
            </motion.aside>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
