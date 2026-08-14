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
          contentContainerClassName="gap-2 pb-8"
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
                className={`flex-row items-start gap-3 rounded-2xl border p-4 ${
                  item.unread ? "border-primary-100 bg-primary-50" : "border-line bg-surface"
                }`}
              >
                <View className="h-9 w-9 items-center justify-center rounded-full bg-surface">
                  <Icon size={16} color={color.primary} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="flex-1 text-body-sm font-semibold text-ink">{item.title}</Text>
                    {item.unread ? <View className="h-2 w-2 rounded-full bg-primary" /> : null}
                  </View>
                  <Text className="mt-1 text-body-sm leading-5 text-muted">{item.body}</Text>
                  <Text className="mt-1.5 text-caption text-muted">{item.time}</Text>
                </View>
              </PressableScale>
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}
