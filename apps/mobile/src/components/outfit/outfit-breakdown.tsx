import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Card } from "@/components/ui/card";
import { CLOSET_CATEGORIES } from "@/constants/mock-closet";
import type { OutfitItem } from "@/types";

/**
 * The two blocks that make up an outfit detail view. Both were duplicated
 * verbatim between `outfit-today.tsx` and `generate/detail.tsx`.
 */

export function OutfitGallery({ items }: { items: OutfitItem[] }) {
  return (
    <View className="flex-row flex-wrap gap-md">
      {items.map((item) => (
        <GarmentSwatch
          key={item.id}
          category={item.category}
          colorHex={item.colorHex}
          className="aspect-square w-[48.5%] overflow-hidden rounded-lg"
          iconSize={30}
        />
      ))}
    </View>
  );
}

export function OutfitBreakdown({ items }: { items: OutfitItem[] }) {
  return (
    <View className="gap-md">
      {items.map((item) => {
        const categoryLabel = CLOSET_CATEGORIES.find((c) => c.key === item.category)?.label;
        return (
          <Card key={item.id} className="flex-row items-center gap-md p-md">
            <GarmentSwatch
              category={item.category}
              colorHex={item.colorHex}
              className="h-14 w-14 overflow-hidden rounded-md"
              iconSize={20}
            />
            <View className="flex-1">
              <Text className="text-h3 font-semibold text-text-primary">{item.label}</Text>
              <Text className="mt-0.5 text-caption text-text-muted">{categoryLabel}</Text>
            </View>
          </Card>
        );
      })}
    </View>
  );
}
