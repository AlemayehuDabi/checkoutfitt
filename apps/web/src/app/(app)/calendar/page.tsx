import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "Outfit Calendar" };

export default function Page() {
  return (
    <StateView
      icon={<Calendar />}
      title="Outfit Calendar is coming soon"
      description="Plan what you'll wear, day by day, and look back at what you wore."
    />
  );
}
