import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { PressableScale } from "@/components/ui/pressable-scale";

type SocialButtonProps = {
  provider: "apple" | "google";
  onPress?: () => void;
};

export function SocialButton({ provider, onPress }: SocialButtonProps) {
  const label = provider === "apple" ? "Continue with Apple" : "Continue with Google";
  const icon = provider === "apple" ? "logo-apple" : "logo-google";

  return (
    <PressableScale
      onPress={onPress}
      className="h-[56px] w-full flex-row items-center justify-center rounded-2xl border border-[#E5E5E5] bg-white px-6 "
    >
      <View className="absolute left-6">
        <Ionicons name={icon} size={22} color="#1A1A1A" />
      </View>
      <Text className="text-[15px] font-semibold text-[#1A1A1A]">
        {label}
      </Text>
    </PressableScale>
  );
}