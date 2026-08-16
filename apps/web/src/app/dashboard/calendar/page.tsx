import type { Metadata } from "next";
import { CalendarView } from "@/components/calendar/calendar-view";

export const metadata: Metadata = {
  title: "Outfit Calendar",
  description: "Plan what you'll wear, day by day.",
};

export default function CalendarPage() {
  return <CalendarView />;
}
