import { type LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { color } from "@/design";

type StateTone = "neutral" | "error";

type StateViewProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  tone?: StateTone;
  /** Set when the view sits inside a padded parent rather than filling a screen. */
  inline?: boolean;
};

export function StateView({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  tone = "neutral",
  inline = false,
}: StateViewProps) {
  const isError = tone === "error";

  return (
    <View className={`items-center justify-center ${inline ? "py-10" : "flex-1 px-gutter"}`}>
      <View
        className={`h-16 w-16 items-center justify-center rounded-3xl ${
          isError ? "bg-danger-soft" : "bg-surface-muted"
        }`}
      >
        <Icon size={26} color={isError ? color.danger : color.muted} strokeWidth={1.5} />
      </View>
      <Text className="mt-5 text-center text-h3 font-bold text-ink">{title}</Text>
      {description ? (
        <Text className="mt-2 max-w-xs text-center text-body leading-6 text-muted">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant={isError ? "outline" : "primary"}
          className="mt-7 w-full"
        />
      ) : null}
      {secondaryLabel && onSecondary ? (
        <Button label={secondaryLabel} onPress={onSecondary} variant="ghost" className="mt-2 w-full" />
      ) : null}
    </View>
  );
}
