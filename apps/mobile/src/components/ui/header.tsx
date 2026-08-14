import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { color } from "@/design";

type HeaderProps = {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: ReactNode;
  /** Inverse treatment for camera / immersive screens. */
  dark?: boolean;
};

export function Header({ title, onBack, showBack = true, right, dark = false }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between pb-2 pt-4">
      {showBack ? (
        <IconButton onPress={onBack ?? (() => router.back())} accessibilityLabel="Go back">
          <ArrowLeft size={22} color={dark ? color.canvas : color.ink} />
        </IconButton>
      ) : (
        <View className="h-10 w-10" />
      )}
      {title ? (
        <Text
          className={`flex-1 text-center text-body font-semibold ${dark ? "text-canvas" : "text-ink"}`}
          numberOfLines={1}
        >
          {title}
        </Text>
      ) : (
        <View className="flex-1" />
      )}
      {right ?? <View className="h-10 w-10" />}
    </View>
  );
}
