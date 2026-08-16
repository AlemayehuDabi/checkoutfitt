import type { Metadata } from "next";
import { mockGapAnalysis } from "@/lib/mock-data";
import { GapAnalysisView } from "@/components/insights/gap-analysis-view";

export const metadata: Metadata = {
  title: "Wardrobe Gaps",
  description: "The missing staples that would unlock the most new outfits.",
};

export default function WardrobeGapsPage() {
  return <GapAnalysisView analysis={mockGapAnalysis} />;
}
