import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { StateView } from "@/components/ui/state-view";

export const metadata: Metadata = { title: "Shopping Assistant" };

export default function Page() {
  return (
    <StateView
      icon={<ShoppingBag />}
      title="Shopping Assistant is coming soon"
      description="Check whether a piece is worth buying before you spend anything."
    />
  );
}
