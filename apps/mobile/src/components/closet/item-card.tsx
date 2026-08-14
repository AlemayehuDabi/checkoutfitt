import { Heart } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { PressableScale } from "@/components/ui/pressable-scale";
import { color, elevation } from "@/design";
import type { ClosetItem } from "@/types";

type ItemCardProps = {
  item: ClosetItem;
  layout: "grid" | "list";
  onPress: () => void;
  onToggleFavorite: () => void;
};

/** Shared favourite control so grid and list stay in sync visually. */
function FavouriteButton({
  favorite,
  onPress,
  className = "",
}: {
  favorite: boolean;
  onPress: () => void;
  className?: string;
}) {
  const scale = useSharedValue(1);
  const isFirstRun = useSharedValue(true);

  useEffect(() => {
    if (isFirstRun.value) {
      isFirstRun.value = false;
      return;
    }
    if (favorite) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 9, stiffness: 380 }),
        withSpring(1, { damping: 14, stiffness: 300 })
      );
    }
  }, [favorite, scale, isFirstRun]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={favorite ? "Remove from favourites" : "Add to favourites"}
      onPress={(event) => {
        event.stopPropagation();
        onPress();
      }}
      className={className}
    >
      <Animated.View style={style}>
        <Heart
          size={16}
          color={favorite ? color.primary : color.muted}
          fill={favorite ? color.primary : "transparent"}
          strokeWidth={2}
        />
      </Animated.View>
    </Pressable>
  );
}

export function ItemCard({ item, layout, onPress, onToggleFavorite }: ItemCardProps) {
  if (layout === "list") {
    return (
      <PressableScale
        onPress={onPress}
        pressScale={0.985}
        style={elevation.sm}
        className="flex-row items-center gap-4 rounded-2xl bg-surface p-3"
      >
        <GarmentSwatch
          category={item.category}
          colorHex={item.colorHex}
          imageUri={item.imageUri}
          className="h-16 w-16 overflow-hidden rounded-xl"
          iconSize={22}
        />
        <View className="flex-1">
          <Text className="text-body font-semibold text-ink" numberOfLines={1}>
            {item.type}
          </Text>
          <Text className="mt-0.5 text-caption text-muted">{item.color}</Text>
        </View>
        <FavouriteButton
          favorite={item.favorite}
          onPress={onToggleFavorite}
          className="h-9 w-9 items-center justify-center rounded-full bg-surface-sunken"
        />
      </PressableScale>
    );
  }

  return (
    <PressableScale
      onPress={onPress}
      pressScale={0.975}
      style={elevation.sm}
      className="flex-1 overflow-hidden rounded-2xl bg-surface"
    >
      <View className="relative">
        <GarmentSwatch
          category={item.category}
          colorHex={item.colorHex}
          imageUri={item.imageUri}
          className="aspect-square w-full"
        />
        <FavouriteButton
          favorite={item.favorite}
          onPress={onToggleFavorite}
          // Frosted chip rather than a flat white circle so it holds up over
          // both photographs and flat colour tiles.
          className="absolute right-2.5 top-2.5 h-9 w-9 items-center justify-center rounded-full bg-surface/90"
        />
      </View>
      <View className="px-3.5 py-3">
        <Text className="text-body-sm font-semibold text-ink" numberOfLines={1}>
          {item.type}
        </Text>
        <Text className="mt-0.5 text-caption text-muted" numberOfLines={1}>
          {item.color}
        </Text>
      </View>
    </PressableScale>
  );
}
