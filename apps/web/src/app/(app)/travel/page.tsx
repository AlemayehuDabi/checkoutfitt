import type { Metadata } from "next";
import { Luggage } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "Travel Packing" };

export default function Page() {
  return (
    <StateView
      icon={<Luggage />}
      title="Travel Packing is coming soon"
      description="Pack for a trip from your own wardrobe, matched to the forecast."
    />
  );
}
