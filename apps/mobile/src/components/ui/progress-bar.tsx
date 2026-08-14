import { View } from "react-native";

type ProgressBarProps = {
  step: number;
  total: number;
};

export function ProgressBar({ step, total }: ProgressBarProps) {
  return (
    <View className="w-full flex-row gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`h-1 flex-1 rounded-full ${index < step ? "bg-primary" : "bg-surface-muted"}`}
        />
      ))}
    </View>
  );
}
