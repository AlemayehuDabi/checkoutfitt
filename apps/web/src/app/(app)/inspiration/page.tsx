import type { Metadata } from "next";
import { Image as ImageIcon } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "Inspiration Match" };

export default function Page() {
  return (
    <StateView
      icon={<ImageIcon />}
      title="Inspiration Match is coming soon"
      description="Match an inspiration photo to the pieces already in your closet."
    />
  );
}
