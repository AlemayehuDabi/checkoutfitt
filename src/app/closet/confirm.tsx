import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { ScreenContainer } from "@/components/ui/screen-container";
import { CLOSET_CATEGORIES, CLOSET_COLORS, randomDetection } from "@/constants/mock-closet";
import { useCloset } from "@/context/closet-context";
import type { ClosetCategory } from "@/types";

export default function ConfirmScreen() {
  const { pendingImages, addItem, setPendingImages } = useCloset();
  const [index, setIndex] = useState(0);

  const imageUri = pendingImages[index];
  const isLast = index === pendingImages.length - 1;

  if (!imageUri) {
    return (
      <ScreenContainer>
        <Header title="Confirm Item" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-muted">Nothing to confirm.</Text>
        </View>
      </ScreenContainer>
    );
  }

  const handleSave = (data: { category: ClosetCategory; type: string; color: string; colorHex: string }) => {
    addItem({ ...data, imageUri });

    if (isLast) {
      setPendingImages([]);
      router.replace("/closet");
      return;
    }

    setIndex((prev) => prev + 1);
  };

  return (
    <ConfirmForm
      key={imageUri}
      imageUri={imageUri}
      index={index}
      total={pendingImages.length}
      isLast={isLast}
      onSave={handleSave}
    />
  );
}

function ConfirmForm({
  imageUri,
  index,
  total,
  isLast,
  onSave,
}: {
  imageUri: string;
  index: number;
  total: number;
  isLast: boolean;
  onSave: (data: { category: ClosetCategory; type: string; color: string; colorHex: string }) => void;
}) {
  const initialCategory = CLOSET_CATEGORIES[index % CLOSET_CATEGORIES.length].key;
  const initialGuess = useMemo(() => randomDetection(initialCategory), [initialCategory]);

  const [category, setCategory] = useState<ClosetCategory>(initialCategory);
  const [type, setType] = useState(initialGuess.type);
  const [color, setColor] = useState(initialGuess.color.name);
  const [colorHex, setColorHex] = useState(initialGuess.color.hex);

  const handleCategoryChange = (next: ClosetCategory) => {
    setCategory(next);
    const guess = randomDetection(next);
    setType(guess.type);
  };

  return (
    <ScreenContainer scroll keyboardAware>
      <Header title={total > 1 ? `Confirm Item ${index + 1} of ${total}` : "Confirm Item"} />

      <GarmentSwatch
        category={category}
        colorHex={colorHex}
        imageUri={imageUri}
        className="h-72 w-full overflow-hidden rounded-3xl"
      />

      <Text className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-clay">
        AI Detected
      </Text>

      <View className="gap-5">
        <View>
          <Text className="mb-2 text-sm font-medium text-ink">Category</Text>
          <View className="flex-row flex-wrap gap-2">
            {CLOSET_CATEGORIES.map((option) => (
              <Chip
                key={option.key}
                label={option.label}
                selected={category === option.key}
                onPress={() => handleCategoryChange(option.key)}
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

      <Button
        label={isLast ? "Save to Closet" : "Save & Next"}
        onPress={() => onSave({ category, type, color, colorHex })}
        disabled={!type.trim()}
        className="mb-2 mt-10"
      />
    </ScreenContainer>
  );
}
