import type { Metadata } from "next";
import { PlanPicker } from "@/components/profile/plan-picker";

export const metadata: Metadata = {
  title: "Subscription",
  description: "Compare Free and Pro, and pick the plan that fits.",
};

export default function SubscriptionPage() {
  return <PlanPicker />;
}
