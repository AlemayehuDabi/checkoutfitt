import { useLocalSearchParams } from "expo-router";
import { Heart, Lightbulb } from "lucide-react-native";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { IconButton } from "@/components/ui/icon-button";
import { ScreenContainer } from "@/components/ui/screen-container";
import { Tag } from "@/components/ui/tag";
import { CLOSET_CATEGORIES } from "@/constants/mock-closet";
import { useOutfits } from "@/context/outfits-context";

export default function OutfitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findOutfit, toggleSave, isSaved } = useOutfits();
  const outfit = findOutfit(id);

  if (!outfit) {
    return (
      <ScreenContainer>
        <Header title="Outfit" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-muted">This outfit is no longer available.</Text>
        </View>
      </ScreenContainer>
    );
  }

  const saved = isSaved(outfit.id);

  return (
    <ScreenContainer scroll>
      <Header title="Outfit Details" />

      <View className="flex-row flex-wrap gap-2">
        {outfit.items.map((item) => (
          <GarmentSwatch
            key={item.id}
            category={item.category}
            colorHex={item.colorHex}
            className="aspect-square w-[48.5%] overflow-hidden rounded-2xl"
            iconSize={30}
          />
        ))}
      </View>

      <View className="mt-6 flex-row items-start justify-between">
        <View className="flex-1">
          <Tag label={outfit.context} tone="clay" />
          <Text className="mt-2 text-2xl font-bold tracking-tight text-ink">{outfit.title}</Text>
        </View>
        <IconButton
          onPress={() => toggleSave(outfit)}
          className="border border-line active:bg-sand-100"
        >
          <Heart size={20} color={saved ? "#C1622D" : "#1A1917"} fill={saved ? "#C1622D" : "transparent"} />
        </IconButton>
      </View>

      <View className="mt-6 flex-row items-start gap-3 rounded-2xl bg-clay-50 p-4">
        <Lightbulb size={20} color="#C1622D" />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-clay-700">Why this outfit</Text>
          <Text className="mt-1 text-sm leading-5 text-ink-soft">{outfit.reason}</Text>
        </View>
      </View>

      <Text className="mb-3 mt-8 text-sm font-semibold text-ink">The Breakdown</Text>
      <View className="gap-3">
        {outfit.items.map((item) => {
          const categoryLabel = CLOSET_CATEGORIES.find((c) => c.key === item.category)?.label;
          return (
            <View
              key={item.id}
              className="flex-row items-center gap-3 rounded-2xl border border-line bg-white p-3"
            >
              <GarmentSwatch
                category={item.category}
                colorHex={item.colorHex}
                className="h-14 w-14 overflow-hidden rounded-xl"
                iconSize={20}
              />
              <View className="flex-1">
                <Text className="text-base font-semibold text-ink">{item.label}</Text>
                <Text className="mt-0.5 text-sm text-muted">{categoryLabel}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <Button
        label={saved ? "Saved to Outfits" : "Save This Outfit"}
        variant={saved ? "outline" : "primary"}
        onPress={() => toggleSave(outfit)}
        className="mb-2 mt-8"
      />
    </ScreenContainer>
  );
}
