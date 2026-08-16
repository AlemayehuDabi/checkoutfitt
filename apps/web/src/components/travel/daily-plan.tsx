"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  Cloud,
  CloudRain,
  CloudSun,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { closetItemById, type MockDailyOutfit } from "@/lib/mock-data";
import { GarmentImage } from "@/components/garment-image";

const CONDITION_ICON: Record<string, React.ElementType> = {
  Clear: Sun,
  Clouds: CloudSun,
  Rain: CloudRain,
};

function dayLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

/** Accordion — one row per trip day, first day open by default. */
export function DailyPlan({ days }: { days: MockDailyOutfit[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState<string | null>(days[0]?.date ?? null);

  return (
    <ul className="overflow-hidden rounded-xl border border-border bg-surface shadow-md">
      {days.map((day, index) => {
        const isOpen = open === day.date;
        const Icon = CONDITION_ICON[day.condition] ?? Cloud;
        const panelId = `day-panel-${day.date}`;

        return (
          <li
            key={day.date}
            className={index > 0 ? "border-t border-border" : undefined}
          >
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : day.date)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-lg px-xl py-lg text-left transition-colors duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500",
                  isOpen ? "bg-primary-50" : "hover:bg-surface-secondary",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex size-10 shrink-0 items-center justify-center rounded-md",
                    isOpen
                      ? "bg-primary-500 text-white"
                      : "bg-surface-secondary text-primary-500",
                  )}
                >
                  <Icon className="size-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-body-semibold",
                      isOpen ? "text-primary-500" : "text-text-primary",
                    )}
                  >
                    {dayLabel(day.date)}
                  </span>
                  <span className="block text-caption text-text-muted">
                    {day.occasion} · {day.condition.toLowerCase()},{" "}
                    <span className="tabular-nums">
                      {Math.round(day.tempCelsius)}°
                    </span>
                  </span>
                </span>

                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 text-text-muted transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="flex flex-col gap-sm px-xl pb-lg">
                    {day.items.map((item) => {
                      const closetItem = closetItemById(item.closetItemId);
                      return (
                        <li key={item.closetItemId}>
                          <Link
                            href={`/closet/${item.closetItemId}`}
                            className="group flex items-center gap-md rounded-md bg-surface-secondary p-2 transition-colors hover:bg-[color:var(--color-overlay-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                          >
                            {closetItem && (
                              <GarmentImage
                                item={closetItem}
                                size="sm"
                                className="size-10 shrink-0 rounded-sm border border-border"
                              />
                            )}
                            <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
                              {item.category}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
