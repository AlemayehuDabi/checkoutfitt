"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarPlus, StickyNote, Trash2, X } from "lucide-react";
import { longDate } from "@/lib/calendar";
import { CONTEXT_LABELS, type MockSchedule } from "@/lib/mock-data";
import { Button, IconButton } from "@/components/ui/button";
import { StateView } from "@/components/ui/state-view";
import { OutfitImage } from "@/components/outfit-image";

/**
 * Day detail. A right-hand drawer on desktop (per §8.8 — a panel, not a
 * modal, so the calendar stays visible while you plan), and a bottom sheet on
 * narrow viewports where a side panel would leave no room for the grid.
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

          <motion.aside
            role="dialog"
            aria-modal="false"
            aria-label={`Plan for ${longDate(dateKey)}`}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: "100%", x: 0 }
            }
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border border-border bg-surface shadow-xl lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[420px] lg:max-h-none lg:rounded-none lg:rounded-l-2xl lg:border-y-0 lg:border-r-0"
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
                    href={`/outfits/${schedule.outfit.id}`}
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
        </>
      )}
    </AnimatePresence>
  );
}
