import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

import { generateOutfit } from "@/constants/mock-outfits";
import { addDays, toISODate } from "@/lib/date";
import type { Outfit, PlannedOutfit } from "@/types";

type PlannerContextValue = {
  /** Keyed by ISO `YYYY-MM-DD`. */
  planned: Record<string, PlannedOutfit>;
  assign: (date: string, outfit: Outfit, note?: string) => void;
  clear: (date: string) => void;
  getPlan: (date: string) => PlannedOutfit | undefined;
  /** Upcoming plans from today forward, soonest first. */
  upcoming: PlannedOutfit[];
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

/** A couple of pre-filled days so the calendar doesn't open empty. */
function seedPlans(): Record<string, PlannedOutfit> {
  const today = new Date();
  const seeds: PlannedOutfit[] = [
    { date: toISODate(addDays(today, 1)), outfit: generateOutfit("Office"), note: "Client review" },
    { date: toISODate(addDays(today, 3)), outfit: generateOutfit("Date Night") },
    { date: toISODate(addDays(today, 6)), outfit: generateOutfit("Weekend") },
  ];
  return Object.fromEntries(seeds.map((plan) => [plan.date, plan]));
}

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [planned, setPlanned] = useState<Record<string, PlannedOutfit>>(seedPlans);

  const value = useMemo<PlannerContextValue>(() => {
    const todayISO = toISODate(new Date());

    return {
      planned,
      assign: (date, outfit, note) => {
        setPlanned((prev) => ({ ...prev, [date]: { date, outfit, note } }));
      },
      clear: (date) => {
        setPlanned((prev) => {
          const next = { ...prev };
          delete next[date];
          return next;
        });
      },
      getPlan: (date) => planned[date],
      upcoming: Object.values(planned)
        .filter((plan) => plan.date >= todayISO)
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  }, [planned]);

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used within a PlannerProvider");
  return ctx;
}
