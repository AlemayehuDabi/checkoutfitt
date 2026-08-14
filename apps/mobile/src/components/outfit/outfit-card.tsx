import { router } from "expo-router";
import { ChevronDown, Heart } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Tag } from "@/components/ui/tag";
import { color, elevation } from "@/design";
import type { Outfit } from "@/types";

type OutfitCardProps = {
  outfit: Outfit;
  saved: boolean;
  onToggleSave: () => void;
  variant?: "full" | "compact";
};

export function OutfitCard({ outfit, saved, onToggleSave, variant = "full" }: OutfitCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isCompact = variant === "compact";

  // The heart pops when it becomes saved — a small reward for the action.
  const heartScale = useSharedValue(1);
  const isFirstRun = useSharedValue(true);

  useEffect(() => {
    if (isFirstRun.value) {
      isFirstRun.value = false;
      return;
    }
    if (saved) {
      heartScale.value = withSequence(
        withSpring(1.28, { damping: 9, stiffness: 380 }),
        withSpring(1, { damping: 14, stiffness: 300 })
      );
    }
  }, [saved, heartScale, isFirstRun]);

  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartScale.value }] }));

  const chevronProgress = useDerivedValue(
    () => withTiming(expanded ? 1 : 0, { duration: 200 }),
    [expanded]
  );
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronProgress.value * 180}deg` }],
  }));

  const tiles = outfit.items.slice(0, isCompact ? 4 : Math.min(outfit.items.length, 4));

  return (
    <PressableScale
      onPress={() => router.push(`/generate/detail?id=${outfit.id}`)}
      pressScale={0.985}
      style={elevation.md}
      className="rounded-3xl bg-surface p-5"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Tag label={outfit.context} tone="primary" />
          <Text className="mt-2.5 text-h3 font-bold text-ink">{outfit.title}</Text>
          <Text className="mt-1 text-caption text-muted">
            {outfit.items.length} piece{outfit.items.length === 1 ? "" : "s"}
          </Text>
        </View>

        <Pressable
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={saved ? "Remove from saved" : "Save outfit"}
          onPress={(event) => {
            event.stopPropagation();
            onToggleSave();
          }}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface-sunken"
        >
          <Animated.View style={heartStyle}>
            <Heart
              size={19}
              color={saved ? color.primary : color.muted}
              fill={saved ? color.primary : "transparent"}
              strokeWidth={2}
            />
          </Animated.View>
        </Pressable>
      </View>

      {/* Inset well behind the garments so the tiles read as contents of the
          card rather than as floating squares. */}
      <View className="mt-4 flex-row gap-2 rounded-2xl bg-surface-sunken p-2">
        {tiles.map((item) => (
          <GarmentSwatch
            key={item.id}
            category={item.category}
            colorHex={item.colorHex}
            className="aspect-square flex-1 overflow-hidden rounded-xl"
            iconSize={18}
          />
        ))}
      </View>

      {isCompact ? null : (
        <>
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            hitSlop={6}
            className="mt-4 flex-row items-center justify-between"
          >
            <Text className="text-body-sm font-semibold text-ink">Why this outfit</Text>
            <Animated.View style={chevronStyle}>
              <ChevronDown size={17} color={color.muted} />
            </Animated.View>
          </Pressable>

          {expanded ? (
            <Animated.View entering={FadeIn.duration(180)}>
              <Text className="mt-2.5 text-body-sm leading-5 text-muted">{outfit.reason}</Text>
            </Animated.View>
          ) : null}

          <Button
            label="View Full Breakdown"
            variant="outline"
            size="sm"
            onPress={() => router.push(`/generate/detail?id=${outfit.id}`)}
            className="mt-5"
          />
        </>
      )}
    </PressableScale>
  );
}
