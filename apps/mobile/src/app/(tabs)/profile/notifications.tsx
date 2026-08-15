import { Bell, Crown, Heart, Sparkles, Sun } from "lucide-react-native";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { Header } from "@/components/ui/header";
import { ScreenContainer } from "@/components/ui/screen-container";
import { StateView } from "@/components/ui/state-view";
import { MOCK_NOTIFICATIONS } from "@/constants/mock-notifications";
import { color } from "@/design";
import type { AppNotification } from "@/types";
import { PressableScale } from "@/components/ui/pressable-scale";

const ICONS: Record<AppNotification["icon"], typeof Bell> = {
  sparkles: Sparkles,
  sun: Sun,
  heart: Heart,
  bell: Bell,
  crown: Crown,
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  }, []);

  return (
    <ScreenContainer>
      <Header title="Notifications" />

      {notifications.length === 0 ? (
        <StateView icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-md pb-4xl"
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={9}
          removeClippedSubviews
          renderItem={({ item }) => {
            const Icon = ICONS[item.icon];
            return (
              <PressableScale
                onPress={() => markRead(item.id)}
                className={`flex-row items-start gap-md rounded-xl border p-lg ${
                  item.unread ? "border-primary-200 bg-primary-50" : "border-border bg-surface"
                }`}
              >
                <View className="h-10 w-10 items-center justify-center rounded-md bg-surface">
                  <Icon size={18} color={color.primary500} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-sm">
                    <Text className="flex-1 text-body font-semibold text-text-primary">{item.title}</Text>
                    {item.unread ? <View className="h-2 w-2 rounded-full bg-primary-500" /> : null}
                  </View>
                  <Text className="mt-1 text-caption text-text-secondary">{item.body}</Text>
                  <Text className="mt-1.5 text-caption text-text-muted">{item.time}</Text>
                </View>
              </PressableScale>
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}
