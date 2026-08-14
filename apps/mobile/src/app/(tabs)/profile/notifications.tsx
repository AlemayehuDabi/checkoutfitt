import { Bell, Crown, Heart, Sparkles, Sun } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Header } from "@/components/ui/header";
import { ScreenContainer } from "@/components/ui/screen-container";
import { StateView } from "@/components/ui/state-view";
import { MOCK_NOTIFICATIONS } from "@/constants/mock-notifications";
import type { AppNotification } from "@/types";

import { color } from "@/design";

const ICONS: Record<AppNotification["icon"], typeof Bell> = {
  sparkles: Sparkles,
  sun: Sun,
  heart: Heart,
  bell: Bell,
  crown: Crown,
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  return (
    <ScreenContainer scroll={notifications.length > 0}>
      <Header title="Notifications" />

      {notifications.length === 0 ? (
        <StateView icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <View className="gap-2 pb-8">
          {notifications.map((notification) => {
            const Icon = ICONS[notification.icon];
            return (
              <Pressable
                key={notification.id}
                onPress={() =>
                  setNotifications((prev) =>
                    prev.map((item) => (item.id === notification.id ? { ...item, unread: false } : item))
                  )
                }
                className={`flex-row items-start gap-3 rounded-2xl border p-4 active:opacity-80 ${
                  notification.unread ? "border-primary-100 bg-primary-50" : "border-line bg-surface"
                }`}
              >
                <View className="h-9 w-9 items-center justify-center rounded-full bg-surface">
                  <Icon size={16} color={color.primary} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="flex-1 text-sm font-semibold text-ink">{notification.title}</Text>
                    {notification.unread ? <View className="h-2 w-2 rounded-full bg-primary" /> : null}
                  </View>
                  <Text className="mt-1 text-sm leading-5 text-muted">{notification.body}</Text>
                  <Text className="mt-1.5 text-xs text-muted">{notification.time}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </ScreenContainer>
  );
}
