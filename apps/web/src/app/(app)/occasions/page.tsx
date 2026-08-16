import type { Metadata } from "next";
import { ALL_CONTEXTS } from "@/lib/occasions";
import { GenerateFlow } from "@/components/outfit/generate-flow";

export const metadata: Metadata = {
  title: "Occasions",
  description: "Dress for something specific — interviews, weddings, travel.",
};

export default function OccasionsPage() {
  return (
    <GenerateFlow
      contexts={ALL_CONTEXTS}
      rich
      heading="Dressing for something specific?"
      subheading="Each occasion has its own rules. Pick one and we'll style to it."
    />
  );
}
