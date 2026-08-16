import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "Profile & Settings" };

export default function Page() {
  return (
    <StateView
      icon={<Settings />}
      title="Profile & Settings is coming soon"
      description="Your sizes, style preferences, location, and account settings."
    />
  );
}
