import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { ScreenContainer } from "@/components/ui/screen-container";
import { CLOSET_CATEGORIES, CLOSET_COLORS } from "@/constants/mock-closet";
import { useCloset } from "@/context/closet-context";
import type { ClosetCategory } from "@/types";

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getItem, updateItem } = useCloset();
  const item = getItem(id);

  const [category, setCategory] = useState<ClosetCategory>(item?.category ?? "top");
  const [type, setType] = useState(item?.type ?? "");
  const [color, setColor] = useState(item?.color ?? "");
  const [colorHex, setColorHex] = useState(item?.colorHex ?? "#1A1917");

  if (!item) {
    return (
      <ScreenContainer>
        <Header title="Edit Item" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-muted">This item no longer exists.</Text>
        </View>
      </ScreenContainer>
    );
  }

  const handleSave = () => {
    updateItem(item.id, { category, type, color, colorHex });
    router.back();
  };

  return (
    <ScreenContainer scroll keyboardAware>
      <Header title="Edit Item" />

      <GarmentSwatch
        category={category}
        colorHex={colorHex}
        imageUri={item.imageUri}
        className="h-64 w-full overflow-hidden rounded-3xl"
      />

      <View className="mt-6 gap-5">
        <View>
          <Text className="mb-2 text-sm font-medium text-ink">Category</Text>
          <View className="flex-row flex-wrap gap-2">
            {CLOSET_CATEGORIES.map((option) => (
              <Chip
                key={option.key}
                label={option.label}
                selected={category === option.key}
                onPress={() => setCategory(option.key)}
              />
            ))}
          </View>
        </View>

        <Input label="Type" value={type} onChangeText={setType} placeholder="e.g. Sweater" />

        <View>
          <Text className="mb-2 text-sm font-medium text-ink">Color</Text>
          <View className="flex-row flex-wrap gap-2">
            {CLOSET_COLORS.map((option) => (
              <Chip
                key={option.name}
                label={option.name}
                selected={color === option.name}
                onPress={() => {
                  setColor(option.name);
                  setColorHex(option.hex);
                }}
              />
            ))}
          </View>
        </View>
      </View>

      <Button label="Save Changes" onPress={handleSave} disabled={!type.trim()} className="mb-2 mt-10" />
    </ScreenContainer>
  );
}
