import { Text, View } from "react-native";

export function Divider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-px flex-1 bg-line" />
      <Text className="text-micro font-semibold uppercase text-muted">{label}</Text>
      <View className="h-px flex-1 bg-line" />
    </View>
  );
}
