import type { Metadata } from "next";
import { TravelView } from "@/components/travel/travel-view";

export const metadata: Metadata = {
  title: "Travel Packing",
  description: "Pack for a trip from your own wardrobe, matched to the forecast.",
};

export default function TravelPage() {
  return <TravelView />;
}
