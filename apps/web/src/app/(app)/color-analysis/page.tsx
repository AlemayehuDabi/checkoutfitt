import type { Metadata } from "next";
import { Droplet } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "Color Analysis" };

export default function Page() {
  return (
    <StateView
      icon={<Droplet />}
      title="Color Analysis is coming soon"
      description="Upload a photo and find the seasonal palette that suits your colouring."
    />
  );
}
