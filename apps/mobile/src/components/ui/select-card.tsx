import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type SelectCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  icon?: ReactNode;
};

export function SelectCard({ label, description, selected, onPress, icon }: SelectCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-4 rounded-2xl border px-5 py-4 active:opacity-80 ${
        selected ? "border-ink bg-ink" : "border-line bg-white"
      }`}
    >
      {icon ? <View className="h-10 w-10 items-center justify-center">{icon}</View> : null}
      <View className="flex-1">
        <Text className={`text-base font-semibold ${selected ? "text-sand" : "text-ink"}`}>{label}</Text>
        {description ? (
          <Text className={`mt-0.5 text-sm ${selected ? "text-sand-200" : "text-muted"}`}>
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
