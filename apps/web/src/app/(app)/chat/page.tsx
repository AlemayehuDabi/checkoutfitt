import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "AI Stylist" };

export default function Page() {
  return (
    <StateView
      icon={<MessageCircle />}
      title="AI Stylist is coming soon"
      description="Chat with your stylist about what to wear, and get outfit cards back."
    />
  );
}
