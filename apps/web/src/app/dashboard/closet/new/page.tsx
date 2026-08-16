import type { Metadata } from "next";
import { AddItemFlow } from "./add-item-flow";

export const metadata: Metadata = {
  title: "Add items",
  description: "Upload photos and we'll identify each piece automatically.",
};

export default function AddItemPage() {
  return <AddItemFlow />;
}
