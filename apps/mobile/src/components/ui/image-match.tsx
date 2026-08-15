import { ImageOff } from "lucide-react-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { Meter } from "@/components/ui/meter";
import { PressableScale } from "@/components/ui/pressable-scale";
import { color, elevation } from "@/design";
import { AppImage } from "@/components/ui/app-image";

type ImageMatchProps = {
  /** The inspiration reference being matched against. */
  sourceUri?: string;
  sourceLabel: string;
  /** Rendered representation of the owned item — usually a `GarmentSwatch`. */
  target: ReactNode;
  targetLabel: string;
  targetMeta?: string;
  /** 0–100 similarity. */
  match: number;
  onPress?: () => void;
  className?: string;
};

/**
 * Side-by-side "inspiration vs. what you own" comparison used by the
 * Pinterest / celebrity recreation results.
 */
export function ImageMatch({
  sourceUri,
  sourceLabel,
  target,
  targetLabel,
  targetMeta,
  match,
  onPress,
  className = "",
}: ImageMatchProps) {
  const Wrapper = onPress ? PressableScale : View;

  return (
    <Wrapper
      onPress={onPress}
      style={elevation.md}
      className={`rounded-xl border border-border bg-surface p-lg ${className}`}
    >
      <View className="flex-row items-center gap-md">
        <View className="flex-1 items-center">
          <View className="aspect-square w-full overflow-hidden rounded-md border border-border bg-surface-secondary">
            {sourceUri ? (
              <AppImage source={{ uri: sourceUri }} className="h-full w-full" contentFit="cover" />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <ImageOff size={22} color={color.textMuted} strokeWidth={1.5} />
              </View>
            )}
          </View>
          <Text className="mt-sm text-eyebrow font-semibold uppercase text-text-muted" numberOfLines={1}>
            {sourceLabel}
          </Text>
        </View>

        <View
          style={elevation.lg}
          className="z-10 -mx-md h-16 w-16 items-center justify-center rounded-full border-2 border-surface bg-primary-500"
        >
          <Text className="text-body font-bold text-text-on-primary">
            {Math.round(match)}%
          </Text>
          <Text className="text-tag font-medium text-text-on-primary">Match</Text>
        </View>

        <View className="flex-1 items-center">
          <View className="aspect-square w-full overflow-hidden rounded-md border border-border bg-surface-secondary">
            {target}
          </View>
          <Text className="mt-sm text-eyebrow font-semibold uppercase text-text-muted" numberOfLines={1}>
            In your closet
          </Text>
        </View>
      </View>

      <View className="mt-lg">
        <Text className="text-h3 font-semibold text-text-primary" numberOfLines={1}>
          {targetLabel}
        </Text>
        {targetMeta ? (
          <Text className="mt-0.5 text-caption text-text-muted" numberOfLines={1}>
            {targetMeta}
          </Text>
        ) : null}
      </View>

      <Meter label="Match" value={match} valueLabel={`${Math.round(match)}%`} className="mt-md" />
    </Wrapper>
  );
}
