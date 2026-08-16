import type { Metadata } from "next";
import { SettingsList } from "@/components/profile/settings-list";

export const metadata: Metadata = {
  title: "Settings",
  description: "Preferences, subscription, privacy, and account.",
};

export default function SettingsPage() {
  return <SettingsList />;
}
