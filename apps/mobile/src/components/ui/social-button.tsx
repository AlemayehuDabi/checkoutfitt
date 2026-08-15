import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";

import { color } from "@/design";

type SocialButtonProps = {
  provider: "apple" | "google";
  onPress?: () => void;
};

const providerConfig = {
  apple: { icon: "logo-apple" as const, label: "Apple" },
  google: { icon: "logo-google" as const, label: "Google" },
};

export function SocialButton({ provider, onPress }: SocialButtonProps) {
  const { icon, label } = providerConfig[provider];

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${label}`}
      className="h-[52px] w-full flex-row items-center justify-center rounded-lg border-[1.5px] border-border-strong bg-surface px-lg"
    >
      {/* Absolute so the glyph sits at the leading edge while the label stays
          optically centred — the pattern the mockups use for both providers. */}
      <View className="absolute left-lg">
        <Ionicons name={icon} size={20} color={color.textPrimary} />
      </View>
      <Text className="text-body font-semibold text-text-primary" numberOfLines={1}>
        {label}
      </Text>
    </PressableScale>
  );
}
