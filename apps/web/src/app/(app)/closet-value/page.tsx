import type { Metadata } from "next";
import { buildMockClosetValue } from "@/lib/mock-data";
import { ClosetValueView } from "@/components/insights/closet-value-view";

export const metadata: Metadata = {
  title: "Closet Value",
  description: "What your wardrobe is worth, broken down by category.",
};

export default function ClosetValuePage() {
  return <ClosetValueView value={buildMockClosetValue()} />;
}
