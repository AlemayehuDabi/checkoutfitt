import { type LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";

type StateViewProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: "neutral" | "error";
};

export function StateView({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  tone = "neutral",
}: StateViewProps) {
  const isError = tone === "error";

  return (
    <View className="flex-1 items-center justify-center px-6">
      <View
        className={`h-20 w-20 items-center justify-center rounded-full ${
          isError ? "bg-danger/10" : "bg-sand-100"
        }`}
      >
        <Icon size={28} color={isError ? "#C1432D" : "#8A8580"} strokeWidth={1.5} />
      </View>
      <Text className="mt-6 text-center text-xl font-bold tracking-tight text-ink">{title}</Text>
      {description ? (
        <Text className="mt-2 text-center text-base leading-6 text-muted">{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant={isError ? "outline" : "primary"}
          className="mt-8 w-full"
        />
      ) : null}
    </View>
  );
}
