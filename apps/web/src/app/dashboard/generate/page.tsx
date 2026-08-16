import type { Metadata } from "next";
import { BASE_CONTEXTS } from "@/lib/occasions";
import { GenerateFlow } from "@/components/outfit/generate-flow";

export const metadata: Metadata = {
  title: "Generate an outfit",
  description: "Pick an occasion and get a look built from your own closet.",
};

export default function GeneratePage() {
  return (
    <GenerateFlow
      contexts={BASE_CONTEXTS}
      heading="What's the occasion?"
      subheading="We'll build a look from pieces you already own."
    />
  );
}
