import type { Metadata } from "next";
import { Star } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "Outfit Rating" };

export default function Page() {
  return (
    <StateView
      icon={<Star />}
      title="Outfit Rating is coming soon"
      description="Score a look on colour harmony, fit, and how well it suits the occasion."
    />
  );
}
