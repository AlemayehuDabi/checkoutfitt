import { Check } from "lucide-react-native";
import { Pressable, Text } from "react-native";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1.5 rounded-full border px-4 py-2.5 active:opacity-80 ${
        selected ? "border-ink bg-ink" : "border-line bg-white"
      }`}
    >
      {selected ? <Check size={14} color="#FAF8F5" /> : null}
      <Text className={`text-sm font-medium ${selected ? "text-sand" : "text-ink"}`}>{label}</Text>
    </Pressable>
  );
}
