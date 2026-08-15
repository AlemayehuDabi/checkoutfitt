import { type LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { ICON_SIZE, IconWell } from "@/components/ui/icon-well";
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
    <View className={`items-center justify-center ${inline ? "py-4xl" : "flex-1 px-gutter"}`}>
      <IconWell size="xl" tone={isError ? "danger" : "sunken"}>
        <Icon
          size={ICON_SIZE.xl}
          color={isError ? color.danger : color.textMuted}
          strokeWidth={1.5}
        />
      </IconWell>
      <Text className="mt-xl text-center text-h2 font-bold text-text-primary">{title}</Text>
      {description ? (
        <Text className="mt-sm max-w-xs text-center text-body text-text-muted">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant={isError ? "secondary" : "primary"}
          className="mt-3xl w-full"
        />
      ) : null}
      {secondaryLabel && onSecondary ? (
        <Button label={secondaryLabel} onPress={onSecondary} variant="ghost" className="mt-sm w-full" />
      ) : null}
    </View>
  );
}
