import type { Metadata } from "next";
import { Palette } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "Style Coach" };

export default function Page() {
  return (
    <StateView
      icon={<Palette />}
      title="Style Coach is coming soon"
      description="Have your whole wardrobe read as a collection and get your style archetype."
    />
  );
}
