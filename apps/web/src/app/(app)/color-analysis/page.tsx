import type { Metadata } from "next";
import { ColorAnalysisView } from "@/components/color-analysis/color-analysis-view";

export const metadata: Metadata = {
  title: "Color Analysis",
  description: "Find the seasonal palette that suits your colouring.",
};

export default function ColorAnalysisPage() {
  return <ColorAnalysisView />;
}
