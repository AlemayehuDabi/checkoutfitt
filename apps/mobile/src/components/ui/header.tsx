import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";

type HeaderProps = {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: ReactNode;
};

export function Header({ title, onBack, showBack = true, right }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between pb-2 pt-6">
      {showBack ? (
        <IconButton onPress={onBack ?? (() => router.back())}>
          <ArrowLeft size={22} color="#1A1917" />
        </IconButton>
      ) : (
        <View className="h-10 w-10" />
      )}
      {title ? (
        <Text className="flex-1 text-center text-base font-semibold text-ink" numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View className="flex-1" />
      )}
      {right ?? <View className="h-10 w-10" />}
    </View>
  );
}
