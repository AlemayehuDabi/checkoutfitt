import { Heart } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import type { ClosetItem } from "@/types";

import { color } from "@/design";

type ItemCardProps = {
  item: ClosetItem;
  layout: "grid" | "list";
  onPress: () => void;
  onToggleFavorite: () => void;
};

export function ItemCard({ item, layout, onPress, onToggleFavorite }: ItemCardProps) {
  if (layout === "list") {
    return (
      <Pressable
        onPress={onPress}
        className="flex-row items-center gap-4 rounded-2xl border border-line bg-surface p-3 active:opacity-80"
      >
        <GarmentSwatch
          category={item.category}
          colorHex={item.colorHex}
          imageUri={item.imageUri}
          className="h-16 w-16 overflow-hidden rounded-xl"
          iconSize={22}
        />
        <View className="flex-1">
          <Text className="text-base font-semibold text-ink">{item.type}</Text>
          <Text className="mt-0.5 text-sm text-muted">{item.color}</Text>
        </View>
        <Pressable hitSlop={8} onPress={onToggleFavorite} className="active:opacity-60">
          <Heart
            size={20}
            color={item.favorite ? color.primary : color.muted}
            fill={item.favorite ? color.primary : "transparent"}
          />
        </Pressable>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} className="flex-1 active:opacity-80">
      <View className="overflow-hidden rounded-2xl border border-line bg-surface">
        <View className="relative">
          <GarmentSwatch
            category={item.category}
            colorHex={item.colorHex}
            imageUri={item.imageUri}
            className="aspect-square w-full"
          />
          <Pressable
            hitSlop={8}
            onPress={onToggleFavorite}
            className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-white/90 active:opacity-70"
          >
            <Heart
              size={16}
              color={item.favorite ? color.primary : color.muted}
              fill={item.favorite ? color.primary : "transparent"}
            />
          </Pressable>
        </View>
        <View className="p-3">
          <Text className="text-sm font-semibold text-ink" numberOfLines={1}>
            {item.type}
          </Text>
          <Text className="mt-0.5 text-xs text-muted">{item.color}</Text>
        </View>
      </View>
    </Pressable>
  );
}
