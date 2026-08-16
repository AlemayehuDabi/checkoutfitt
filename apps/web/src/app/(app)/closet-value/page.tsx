import type { Metadata } from "next";
import { DollarSign } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "Closet Value" };

export default function Page() {
  return (
    <StateView
      icon={<DollarSign />}
      title="Closet Value is coming soon"
      description="See what your wardrobe is worth, broken down by category."
    />
  );
}
