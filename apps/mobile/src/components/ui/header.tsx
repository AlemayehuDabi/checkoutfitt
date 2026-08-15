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

/**
 * Spec §6.9: 56px tall, transparent so content scrolls beneath, 24px back
 * arrow, title set in `h3`.
 */
export function Header({ title, onBack, showBack = true, right, dark = false }: HeaderProps) {
  return (
    <View className="h-14 flex-row items-center justify-between bg-transparent">
      {showBack ? (
        <IconButton onPress={onBack ?? (() => router.back())} accessibilityLabel="Go back">
          <ArrowLeft size={24} color={dark ? color.canvas : color.textPrimary} />
        </IconButton>
      ) : (
        <View className="h-10 w-10" />
      )}
      {title ? (
        <Text
          className={`flex-1 text-center text-h3 font-semibold ${
            dark ? "text-canvas" : "text-text-primary"
          }`}
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
