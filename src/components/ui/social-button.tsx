import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

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
    <Pressable
      onPress={onPress}
      className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-line bg-white active:bg-sand-100"
    >
      <Ionicons name={icon} size={18} color="#1A1917" />
      <Text className="text-sm font-semibold text-ink" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}
