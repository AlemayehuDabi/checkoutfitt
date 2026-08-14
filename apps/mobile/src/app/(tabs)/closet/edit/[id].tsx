import { router, useLocalSearchParams } from "expo-router";
import { Shirt } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { ScreenContainer } from "@/components/ui/screen-container";
import { StateView } from "@/components/ui/state-view";
import { CLOSET_CATEGORIES, CLOSET_COLORS } from "@/constants/mock-closet";
import { useCloset } from "@/context/closet-context";
import type { ClosetCategory } from "@/types";

// Aliased: this screen has a local `color` state holding the garment colour name.
import { color as token } from "@/design";

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getItem, updateItem } = useCloset();
  const item = getItem(id);

  const [category, setCategory] = useState<ClosetCategory>(item?.category ?? "top");
  const [type, setType] = useState(item?.type ?? "");
  const [color, setColor] = useState(item?.color ?? "");
  const [colorHex, setColorHex] = useState(item?.colorHex ?? token.ink);

  if (!item) {
    return (
      <ScreenContainer>
        <Header title="Edit Item" />
        <StateView
          icon={Shirt}
          title="Item not found"
          description="This piece is no longer in your closet."
          actionLabel="Back to Closet"
          onAction={() => router.replace("/closet")}
        />
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
