"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsClient } from "@/lib/use-is-client";
import {
  WEEKDAYS,
  buildMonthGrid,
  buildMonthStrip,
  longDate,
  monthLabel,
  todayKey,
  type CalendarDay,
} from "@/lib/calendar";
import {
  buildMockSchedules,
  type MockOutfit,
  type MockSchedule,
} from "@/lib/mock-data";
import { Button, IconButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { OutfitImage } from "@/components/outfit-image";
import { DayPanel } from "./day-panel";
import { OutfitPickerModal } from "./outfit-picker-modal";

function DayCell({
  day,
  schedule,
  selected,
  onSelect,
}: {
  day: CalendarDay;
  schedule: MockSchedule | undefined;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${longDate(day.key)}${schedule ? ", outfit planned" : ", nothing planned"}`}
      aria-current={day.isToday ? "date" : undefined}
      className={cn(
        "group relative flex min-h-[92px] cursor-pointer flex-col items-start gap-1 p-2 text-left transition-colors duration-150",
        "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500",
        day.inMonth
          ? "hover:bg-surface-secondary"
          : "bg-bg/40 text-text-muted hover:bg-surface-secondary/60",
        selected && "ring-2 ring-primary-500 ring-inset",
      )}
    >
      <span
        className={cn(
          "inline-flex size-7 shrink-0 items-center justify-center rounded-full text-sm tabular-nums transition-colors",
          day.isToday
            ? "bg-primary-500 font-[600] text-text-on-primary"
            : day.inMonth
              ? "text-text-primary"
              : "text-text-muted",
        )}
      >
        {day.dayOfMonth}
      </span>

      {schedule && (
        <span className="w-full overflow-hidden rounded-sm border border-border">
          <OutfitImage
            items={schedule.outfit.items}
            className="h-9 w-full transition-transform duration-200 group-hover:scale-[1.04]"
          />
        </span>
      )}
    </button>
  );
}

function CalendarSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-2xl shadow-md">
      <div className="mb-xl flex items-center justify-between">
        <Skeleton className="h-7 w-44 rounded-md" />
        <div className="flex gap-sm">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-[560px] w-full rounded-md" />
    </div>
  );
}

export function CalendarView() {
  const isClient = useIsClient();
  const { toast } = useToast();
  const reduce = useReducedMotion();

  // Lazy initialisers rather than a mount effect. These read the current date,
  // which differs between build and run — safe here because nothing derived
  // from them renders until `isClient` flips, and until then both server and
  // client render the same skeleton.
  const [schedules, setSchedules] = React.useState<MockSchedule[]>(() =>
    buildMockSchedules(),
  );
  const [cursor, setCursor] = React.useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [direction, setDirection] = React.useState(1);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const byDate = React.useMemo(() => {
    const map = new Map<string, MockSchedule>();
    for (const schedule of schedules) map.set(schedule.date, schedule);
    return map;
  }, [schedules]);

  if (!isClient) {
    return (
      <div className="py-4xl">
        <CalendarSkeleton />
      </div>
    );
  }

  const { year, month } = cursor;
  const weeks = buildMonthGrid(year, month);
  const strip = buildMonthStrip(year, month);
  const monthCount = strip.filter((d) => byDate.has(d.key)).length;

  function step(delta: number) {
    setDirection(delta);
    setCursor((current) => {
      const next = new Date(Date.UTC(current.year, current.month + delta, 1));
      return { year: next.getUTCFullYear(), month: next.getUTCMonth() };
    });
  }

  function goToday() {
    const now = new Date();
    setDirection(1);
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
    setSelected(todayKey());
  }

  function assign(outfit: MockOutfit) {
    if (!selected) return;
    setSchedules((current) => [
      ...current.filter((s) => s.date !== selected),
      {
        id: `os_${Date.now()}`,
        ownerId: "usr_2n8fq0x1a",
        outfitId: outfit.id,
        date: selected,
        notes: null,
        createdAt: new Date().toISOString(),
        outfit,
      },
    ]);
    setPickerOpen(false);
    toast({
      kind: "success",
      title: "Outfit planned",
      description: `Set for ${longDate(selected)}.`,
    });
  }

  function remove() {
    if (!selected) return;
    setSchedules((current) => current.filter((s) => s.date !== selected));
    toast({ kind: "info", title: "Outfit removed", description: "That day is clear again." });
  }

  return (
    <div className="py-4xl">
      <div className="rounded-xl border border-border bg-surface p-lg shadow-md sm:p-2xl">
        {/* Header */}
        <div className="mb-xl flex flex-wrap items-center justify-between gap-lg">
          <div>
            <h2 className="text-h2 text-text-primary">{monthLabel(year, month)}</h2>
            <p className="mt-0.5 text-caption text-text-muted tabular-nums">
              {monthCount} {monthCount === 1 ? "outfit" : "outfits"} planned
            </p>
          </div>
          <div className="flex items-center gap-sm">
            <Button variant="ghost" size="sm" onClick={goToday}>
              Today
            </Button>
            <IconButton label="Previous month" onClick={() => step(-1)}>
              <ChevronLeft aria-hidden className="size-5" />
            </IconButton>
            <IconButton label="Next month" onClick={() => step(1)}>
              <ChevronRight aria-hidden className="size-5" />
            </IconButton>
          </div>
        </div>

        {/* Grid — md and up */}
        <div className="hidden md:block">
          <div className="grid grid-cols-7 border-b border-border">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="px-2 pb-md text-eyebrow uppercase text-text-muted"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={`${year}-${month}`}
                custom={direction}
                initial={reduce ? false : { opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="divide-y divide-border"
              >
                {weeks.map((week, index) => (
                  <div
                    key={index}
                    className={cn(
                      "grid grid-cols-7 divide-x divide-border",
                      // Alternating tone gives the grid a planner rhythm.
                      index % 2 === 1 && "bg-surface-secondary/35",
                    )}
                  >
                    {week.map((day) => (
                      <DayCell
                        key={day.key}
                        day={day}
                        schedule={byDate.get(day.key)}
                        selected={selected === day.key}
                        onSelect={() => setSelected(day.key)}
                      />
                    ))}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Strip — below md, a scrollable row of the month's days */}
        <div className="md:hidden">
          <div className="no-scrollbar -mx-lg overflow-x-auto px-lg">
            <div className="flex w-max gap-sm">
              {strip.map((day) => {
                const schedule = byDate.get(day.key);
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => setSelected(day.key)}
                    aria-label={`${longDate(day.key)}${schedule ? ", outfit planned" : ", nothing planned"}`}
                    aria-current={day.isToday ? "date" : undefined}
                    className={cn(
                      "flex w-[68px] cursor-pointer flex-col items-center gap-1.5 rounded-md border p-2 transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                      selected === day.key
                        ? "border-[1.5px] border-primary-500 bg-primary-50"
                        : "border-border bg-surface hover:bg-surface-secondary",
                    )}
                  >
                    <span className="text-eyebrow uppercase text-text-muted">
                      {WEEKDAYS[day.date.getUTCDay()]}
                    </span>
                    <span
                      className={cn(
                        "inline-flex size-7 items-center justify-center rounded-full text-sm tabular-nums",
                        day.isToday
                          ? "bg-primary-500 font-[600] text-text-on-primary"
                          : "text-text-primary",
                      )}
                    >
                      {day.dayOfMonth}
                    </span>
                    {schedule ? (
                      <OutfitImage
                        items={schedule.outfit.items}
                        className="h-8 w-full overflow-hidden rounded-sm border border-border"
                      />
                    ) : (
                      <span className="h-8 w-full rounded-sm bg-surface-secondary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mt-md flex items-center gap-sm text-caption text-text-muted">
            <CalendarDays aria-hidden className="size-3.5" />
            Scroll to see the rest of the month
          </p>
        </div>
      </div>

      <DayPanel
        dateKey={selected}
        schedule={selected ? byDate.get(selected) : undefined}
        onClose={() => setSelected(null)}
        onAssign={() => setPickerOpen(true)}
        onRemove={remove}
      />

      <OutfitPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={assign}
        dateLabel={selected ? longDate(selected) : ""}
      />
    </div>
  );
}
