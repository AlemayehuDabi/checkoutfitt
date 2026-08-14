import { ArrowLeftRight, ImageOff } from "lucide-react-native";
import { type ReactNode } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Meter } from "@/components/ui/meter";
import { color } from "@/design";

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
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      className={`rounded-2xl border border-line bg-surface p-4 ${
        onPress ? "active:opacity-90" : ""
      } ${className}`}
    >
      <View className="flex-row items-center gap-3">
        <View className="flex-1 items-center">
          <View className="aspect-square w-full overflow-hidden rounded-xl bg-surface-sunken">
            {sourceUri ? (
              <Image source={{ uri: sourceUri }} className="h-full w-full" resizeMode="cover" />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <ImageOff size={22} color={color.faint} strokeWidth={1.5} />
              </View>
            )}
          </View>
          <Text className="mt-2 text-micro font-semibold uppercase text-muted" numberOfLines={1}>
            {sourceLabel}
          </Text>
        </View>

        <View className="items-center">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-50">
            <ArrowLeftRight size={15} color={color.primary} />
          </View>
        </View>

        <View className="flex-1 items-center">
          <View className="aspect-square w-full overflow-hidden rounded-xl bg-surface-sunken">
            {target}
          </View>
          <Text className="mt-2 text-micro font-semibold uppercase text-muted" numberOfLines={1}>
            In your closet
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-body font-semibold text-ink" numberOfLines={1}>
          {targetLabel}
        </Text>
        {targetMeta ? (
          <Text className="mt-0.5 text-caption text-muted" numberOfLines={1}>
            {targetMeta}
          </Text>
        ) : null}
      </View>

      <Meter label="Match" value={match} valueLabel={`${Math.round(match)}%`} className="mt-3" />
    </Wrapper>
  );
}
