import type { Metadata } from "next";
import { StyleCoachView } from "@/components/style-coach/style-coach-view";

export const metadata: Metadata = {
  title: "Style Coach",
  description: "Find the archetype your wardrobe expresses, and how to lean into it.",
};

export default function StyleCoachPage() {
  return <StyleCoachView />;
}
