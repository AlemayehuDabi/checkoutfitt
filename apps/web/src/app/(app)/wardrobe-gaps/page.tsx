import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "Wardrobe Gaps" };

export default function Page() {
  return (
    <StateView
      icon={<BarChart3 />}
      title="Wardrobe Gaps is coming soon"
      description="See the missing staples that would unlock the most new outfits."
    />
  );
}
