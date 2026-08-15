import { Text, View } from "react-native";

export function Divider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-md">
      <View className="h-px flex-1 bg-border" />
      <Text className="text-eyebrow font-semibold uppercase text-text-muted">{label}</Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}
