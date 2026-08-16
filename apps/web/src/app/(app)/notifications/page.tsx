import type { Metadata } from "next";
import { NotificationsList } from "@/components/profile/notifications-list";

export const metadata: Metadata = {
  title: "Notifications",
  description: "What's happened in your wardrobe lately.",
};

export default function NotificationsPage() {
  return <NotificationsList />;
}
