import type { Metadata } from "next";
import { mockClosetItems } from "@/lib/mock-data";
import { ClosetBrowser } from "@/components/closet/closet-browser";

export const metadata: Metadata = {
  title: "My Closet",
  description: "Every piece you own, catalogued and searchable.",
};

export default function ClosetPage() {
  return <ClosetBrowser items={mockClosetItems} />;
}
