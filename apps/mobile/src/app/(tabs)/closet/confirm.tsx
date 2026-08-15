import { router } from "expo-router";
import { PackageOpen } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { StateView } from "@/components/ui/state-view";
import { CLOSET_CATEGORIES, CLOSET_COLORS, randomDetection } from "@/constants/mock-closet";
import { useClosetActions, usePendingImages } from "@/context/closet-context";
import type { ClosetCategory } from "@/types";

import { color } from "@/design";

export default function ConfirmScreen() {
  const { pendingImages, setPendingImages } = usePendingImages();
  const { addItem } = useClosetActions();
  const [index, setIndex] = useState(0);

  const imageUri = pendingImages[index];
  const isLast = index === pendingImages.length - 1;

  if (!imageUri) {
    return (
      <ScreenContainer>
        <Header title="Confirm Item" />
        <StateView
          icon={PackageOpen}
          title="Nothing to confirm"
          description="There are no captured photos waiting to be added to your closet."
          actionLabel="Back to Closet"
          onAction={() => router.replace("/closet")}
        />
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
        className="h-72 w-full overflow-hidden rounded-xl"
      />

      <SectionHeader title="AI Detected" index="01" className="mt-2xl" />

      <View className="gap-xl">
        <View>
          <Text className="mb-sm text-caption font-medium text-text-secondary">Category</Text>
          <View className="flex-row flex-wrap gap-sm">
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
          <Text className="mb-sm text-caption font-medium text-text-secondary">Color</Text>
          <View className="flex-row flex-wrap gap-sm">
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
        className="mb-sm mt-4xl"
      />
    </ScreenContainer>
  );
}
