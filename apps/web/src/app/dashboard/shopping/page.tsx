import type { Metadata } from "next";
import { ShoppingView } from "@/components/shopping/shopping-view";

export const metadata: Metadata = {
  title: "Shopping Assistant",
  description: "Check whether a piece earns its place before you buy it.",
};

export default function ShoppingPage() {
  return <ShoppingView />;
}
