import { useLocalSearchParams } from "expo-router";
import { Heart, Shirt } from "lucide-react-native";
import { Text, View } from "react-native";

import { OutfitBreakdown, OutfitGallery } from "@/components/outfit/outfit-breakdown";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { IconButton } from "@/components/ui/icon-button";
import { InsightCallout } from "@/components/ui/insight-callout";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { StateView } from "@/components/ui/state-view";
import { Tag } from "@/components/ui/tag";
import { useOutfits } from "@/context/outfits-context";
import { color } from "@/design";

export default function OutfitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findOutfit, toggleSave, isSaved } = useOutfits();
  const outfit = findOutfit(id);

  if (!outfit) {
    return (
      <ScreenContainer>
        <Header title="Outfit" />
        <StateView
          icon={Shirt}
          title="Outfit unavailable"
          description="This look is no longer available. Generate a fresh one to keep styling."
        />
      </ScreenContainer>
    );
  }

  const saved = isSaved(outfit.id);

  return (
    <ScreenContainer scroll>
      <Header title="Outfit Details" />

      <OutfitGallery items={outfit.items} />

      <View className="mt-2xl flex-row items-start justify-between gap-md">
        <View className="flex-1">
          <Tag label={outfit.context} tone="primary" />
          <Text className="mt-sm text-h1 font-bold text-text-primary">{outfit.title}</Text>
        </View>
        <IconButton
          onPress={() => toggleSave(outfit)}
          variant="solid"
          accessibilityLabel={saved ? "Remove from saved" : "Save outfit"}
        >
          <Heart
            size={24}
            color={saved ? color.primary500 : color.textPrimary}
            fill={saved ? color.primary500 : "transparent"}
          />
        </IconButton>
      </View>

      <InsightCallout title="Why this outfit" body={outfit.reason} className="mt-2xl" />

      <SectionHeader title="Pieces" index="01" className="mt-3xl" />
      <OutfitBreakdown items={outfit.items} />

      <Button
        label={saved ? "Saved to Outfits" : "Save This Outfit"}
        variant={saved ? "secondary" : "primary"}
        onPress={() => toggleSave(outfit)}
        className="mb-sm mt-3xl"
      />
    </ScreenContainer>
  );
}
