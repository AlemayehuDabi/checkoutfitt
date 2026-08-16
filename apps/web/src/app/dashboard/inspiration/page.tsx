import type { Metadata } from "next";
import { InspirationView } from "@/components/inspiration/inspiration-view";

export const metadata: Metadata = {
  title: "Inspiration Match",
  description: "Recreate a saved look using clothes you already own.",
};

export default function InspirationPage() {
  return <InspirationView />;
}
