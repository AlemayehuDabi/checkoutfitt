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
import { color, elevation, motion } from "@/design";
import type { Outfit } from "@/types";

type OutfitCardProps = {
  outfit: Outfit;
  saved: boolean;
  onToggleSave: () => void;
  variant?: "full" | "compact";
};

/**
 * Spec §6.2 hero card + §6.10 hero image.
 *
 * `full` leads with a 3:4 portrait hero — the outfit's pieces tiled into the
 * frame the mockups use for a look's photograph — clipped to the 16px image
 * radius and carrying its own `shadow-md` inside the card's `shadow-lg`.
 * `compact` (used inside chat bubbles) drops the hero for a single row of
 * thumbnails so it can nest without dominating the message.
 */
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
    () => withTiming(expanded ? 1 : 0, { duration: motion.duration.normal }),
    [expanded]
  );
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronProgress.value * 180}deg` }],
  }));

  const tiles = outfit.items.slice(0, 4);

  return (
    <PressableScale
      onPress={() => router.push(`/generate/detail?id=${outfit.id}`)}
      pressScale={motion.pressScale.md}
      pressOpacity={1}
      style={isCompact ? elevation.md : elevation.lg}
      className="rounded-xl border border-border bg-surface p-lg"
    >
      {isCompact ? null : (
        // The hero frame. Tiles wrap into a 2-up mosaic that fills the 3:4
        // portrait proportion the mockups give an outfit photograph.
        <View
          style={elevation.md}
          className="mb-lg aspect-[3/4] w-full flex-row flex-wrap overflow-hidden rounded-lg bg-surface-secondary"
        >
          {tiles.map((item) => (
            <GarmentSwatch
              key={item.id}
              category={item.category}
              colorHex={item.colorHex}
              className={tiles.length > 1 ? "h-1/2 w-1/2" : "h-full w-full"}
              iconSize={tiles.length > 1 ? 32 : 56}
            />
          ))}
        </View>
      )}

      <View className="flex-row items-start justify-between gap-md">
        <View className="flex-1">
          <Tag label={outfit.context} tone="primary" />
          <Text className="mt-sm text-h3 font-semibold text-text-primary">{outfit.title}</Text>
          <Text className="mt-1 text-caption text-text-muted">
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
          className="h-10 w-10 items-center justify-center rounded-full bg-surface-secondary"
        >
          <Animated.View style={heartStyle}>
            <Heart
              size={20}
              color={saved ? color.primary500 : color.textMuted}
              fill={saved ? color.primary500 : "transparent"}
              strokeWidth={2}
            />
          </Animated.View>
        </Pressable>
      </View>

      {isCompact ? (
        // Inset well behind the garments so the tiles read as contents of the
        // card rather than as floating squares.
        <View className="mt-lg flex-row gap-sm rounded-md bg-surface-secondary p-sm">
          {tiles.map((item) => (
            <GarmentSwatch
              key={item.id}
              category={item.category}
              colorHex={item.colorHex}
              className="aspect-square flex-1 overflow-hidden rounded-sm"
              iconSize={18}
            />
          ))}
        </View>
      ) : (
        <>
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            hitSlop={6}
            className="mt-lg flex-row items-center justify-between"
          >
            <Text className="text-body font-semibold text-text-primary">Why this outfit</Text>
            <Animated.View style={chevronStyle}>
              <ChevronDown size={18} color={color.textMuted} />
            </Animated.View>
          </Pressable>

          {expanded ? (
            <Animated.View entering={FadeIn.duration(motion.duration.normal)}>
              <Text className="mt-sm text-body text-text-secondary">{outfit.reason}</Text>
            </Animated.View>
          ) : null}

          <Button
            label="View Full Breakdown"
            variant="secondary"
            size="sm"
            onPress={() => router.push(`/generate/detail?id=${outfit.id}`)}
            className="mt-xl"
          />
        </>
      )}
    </PressableScale>
  );
}
