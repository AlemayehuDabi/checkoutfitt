import type { Metadata } from "next";
import { CapsuleView } from "@/components/capsule/capsule-view";

export const metadata: Metadata = {
  title: "Capsule Builder",
  description: "Curate a small set of pieces that mix into as many outfits as possible.",
};

export default function CapsulePage() {
  return <CapsuleView />;
}
