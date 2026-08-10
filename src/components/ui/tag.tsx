import { Text, View } from "react-native";

type TagProps = {
  label: string;
  tone?: "default" | "clay";
  dotColor?: string;
};

export function Tag({ label, tone = "default", dotColor }: TagProps) {
  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${
        tone === "clay" ? "bg-clay-50" : "bg-sand-100"
      }`}
    >
      {dotColor ? (
        <View
          className="h-2.5 w-2.5 rounded-full border border-line"
          style={{ backgroundColor: dotColor }}
        />
      ) : null}
      <Text className={`text-xs font-medium ${tone === "clay" ? "text-clay-700" : "text-ink-soft"}`}>
        {label}
      </Text>
    </View>
  );
}
