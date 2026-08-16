import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "Capsule Builder" };

export default function Page() {
  return (
    <StateView
      icon={<Layers />}
      title="Capsule Builder is coming soon"
      description="Curate a small set of pieces that mix into as many outfits as possible."
    />
  );
}
