import type { Metadata } from "next";
import { Gallery } from "./gallery";

export const metadata: Metadata = {
  title: "Component Gallery",
  description: "Every shared UI primitive rendered in one place.",
};

export default function ComponentsPage() {
  return <Gallery />;
}
