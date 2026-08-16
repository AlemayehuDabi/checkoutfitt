"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarRange,
  Luggage,
  MapPin,
  Sparkles,
  Thermometer,
} from "lucide-react";
import {
  MAX_TRIP_DAYS,
  TRAVEL_OCCASIONS,
  TRAVEL_OCCASION_LABELS,
  buildMockTravelPlan,
  type MockTravelPlan,
  type TravelOccasion,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { CalloutCard } from "@/components/ui/callout-card";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { DailyPlan } from "./daily-plan";
import { PackingChecklist } from "./packing-checklist";

type Stage = "input" | "planning" | "result";

function isoOffset(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function tripLength(start: string, end: string): number {
  if (!start || !end) return 0;
  const ms =
    new Date(`${end}T00:00:00Z`).getTime() -
    new Date(`${start}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

export function TravelView() {
  const { toast } = useToast();
  const [stage, setStage] = React.useState<Stage>("input");
  const [destination, setDestination] = React.useState("Lisbon");
  const [start, setStart] = React.useState(isoOffset(14));
  const [end, setEnd] = React.useState(isoOffset(19));
  const [occasions, setOccasions] = React.useState<TravelOccasion[]>([
    "sightseeing",
    "dinner",
  ]);
  const [plan, setPlan] = React.useState<MockTravelPlan | null>(null);

  const days = tripLength(start, end);
  const tooLong = days > MAX_TRIP_DAYS;
  const invalidRange = Boolean(start && end) && days < 1;
  const canPlan =
    destination.trim().length > 0 && days >= 1 && !tooLong && !invalidRange;

  const dateError = invalidRange
    ? "End date must be on or after the start date."
    : tooLong
      ? `Trips are limited to ${MAX_TRIP_DAYS} days; this one is ${days}.`
      : undefined;

  function toggleOccasion(value: TravelOccasion) {
    setOccasions((current) =>
      current.includes(value)
        ? current.filter((c) => c !== value)
        : [...current, value],
    );
  }

  function planTrip() {
    setStage("planning");
    window.setTimeout(() => {
      setPlan(buildMockTravelPlan(destination.trim(), start, end, occasions));
      setStage("result");
    }, 2400);
  }

  const dateLabel = plan
    ? new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).formatRange(
        new Date(`${plan.dates.start}T00:00:00Z`),
        new Date(`${plan.dates.end}T00:00:00Z`),
      )
    : "";

  return (
    <div className="mx-auto max-w-[900px] py-2xl">
      <AnimatePresence mode="wait">
        {stage !== "result" ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-h1 text-text-primary text-balance">
              Pack from your own wardrobe
            </h2>
            <p className="mt-sm text-body-lg text-text-secondary">
              Tell us where and when, and we&apos;ll build a packing list matched
              to the forecast — plus what to wear each day.
            </p>

            <div className="mt-3xl flex flex-col gap-2xl">
              <Input
                label="Destination"
                placeholder="City name"
                icon={<MapPin />}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                maxLength={120}
              />

              <div className="grid gap-lg sm:grid-cols-2">
                <Input
                  label="Start date"
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
                <Input
                  label="End date"
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  error={dateError}
                  hint={
                    !dateError && days >= 1
                      ? `${days} ${days === 1 ? "day" : "days"}`
                      : undefined
                  }
                />
              </div>

              <section>
                <SectionHeader
                  eyebrow="What you'll be doing"
                  title="Activities"
                  description="Optional — it shapes how dressy the plan gets."
                  as="h3"
                  className="mb-lg"
                />
                <div className="flex flex-wrap gap-sm">
                  {TRAVEL_OCCASIONS.map((occasion) => (
                    <Chip
                      key={occasion}
                      selected={occasions.includes(occasion)}
                      onClick={() => toggleOccasion(occasion)}
                    >
                      {TRAVEL_OCCASION_LABELS[occasion]}
                    </Chip>
                  ))}
                </div>
              </section>
            </div>

            {stage === "planning" ? (
              <div className="mt-3xl">
                <div className="mb-lg flex items-center gap-md">
                  <Sparkles aria-hidden className="size-5 animate-pulse text-primary-500" />
                  <p aria-live="polite" className="text-body-medium text-text-secondary">
                    Checking the forecast and picking pieces…
                  </p>
                </div>
                <Skeleton className="h-28 w-full rounded-xl" />
                <div className="mt-2xl flex flex-col gap-sm">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-[60px] w-full rounded-md" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3xl flex flex-wrap items-center gap-md">
                <Button
                  size="lg"
                  disabled={!canPlan}
                  onClick={planTrip}
                  iconLeft={<Luggage className="size-4" />}
                >
                  Plan my packing
                </Button>
                {!canPlan && !dateError && (
                  <p className="text-caption text-text-muted">
                    Add a destination and dates to continue.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          plan && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap items-end justify-between gap-lg">
                <div>
                  <p className="flex items-center gap-sm text-eyebrow uppercase text-primary-500">
                    <MapPin aria-hidden className="size-3.5" />
                    {plan.destination}
                  </p>
                  <h2 className="mt-1 text-h1 text-text-primary text-balance">
                    {plan.weather.totalDays}-day packing plan
                  </h2>
                  <p className="mt-sm flex items-center gap-sm text-body text-text-secondary">
                    <CalendarRange aria-hidden className="size-4 text-text-muted" />
                    {dateLabel}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setStage("input")}>
                  Change trip
                </Button>
              </div>

              {/* Forecast */}
              <div className="mt-2xl rounded-xl border border-border bg-surface p-xl shadow-md">
                <div className="flex flex-wrap items-center gap-2xl">
                  <div className="flex items-center gap-md">
                    <span
                      aria-hidden
                      className="inline-flex size-11 items-center justify-center rounded-md bg-primary-50 text-primary-500"
                    >
                      <Thermometer className="size-5" />
                    </span>
                    <div>
                      <p className="text-h3 text-text-primary tabular-nums">
                        {Math.round(plan.weather.tempRange.minCelsius)}° –{" "}
                        {Math.round(plan.weather.tempRange.maxCelsius)}°
                      </p>
                      <p className="text-caption text-text-muted">
                        {plan.weather.conditions.join(" · ")}
                      </p>
                    </div>
                  </div>

                  {plan.weather.partial && (
                    <p className="text-caption text-text-muted">
                      Forecast covers {plan.weather.daysForecast} of{" "}
                      {plan.weather.totalDays} days — later days are planned with
                      adaptable layers.
                    </p>
                  )}
                </div>

                <p className="mt-lg text-body text-text-secondary">
                  {plan.advice}
                </p>
              </div>

              {/* Checklist */}
              <section className="mt-4xl">
                <SectionHeader
                  eyebrow="Take these"
                  title="Packing checklist"
                  description="Tick things off as they go in the bag."
                  as="h3"
                />
                <PackingChecklist items={plan.packingList} />
              </section>

              {/* Daily plan */}
              <section className="mt-4xl">
                <SectionHeader
                  eyebrow="Day by day"
                  title="Daily outfit plan"
                  description="Every look uses only what's on the checklist."
                  as="h3"
                />
                <DailyPlan days={plan.dailyOutfits} />
              </section>

              <CalloutCard icon={<Sparkles />} className="mt-2xl">
                Optimizing trims the list to the smallest set that still covers
                every day and activity — usually two or three fewer pieces.
              </CalloutCard>

              <div className="mt-3xl flex flex-wrap gap-md">
                <Button
                  variant="secondary"
                  iconLeft={<Luggage className="size-4" />}
                  onClick={() =>
                    toast({
                      kind: "info",
                      title: "Packing optimized",
                      description: "Trimmed to the smallest set that still covers the trip.",
                    })
                  }
                >
                  Optimize my packing
                </Button>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
