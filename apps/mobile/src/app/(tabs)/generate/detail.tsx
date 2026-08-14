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

      <View className="mt-6 flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Tag label={outfit.context} tone="primary" />
          <Text className="mt-2 text-h2 font-bold text-ink">{outfit.title}</Text>
        </View>
        <IconButton
          onPress={() => toggleSave(outfit)}
          variant="solid"
          accessibilityLabel={saved ? "Remove from saved" : "Save outfit"}
        >
          <Heart
            size={20}
            color={saved ? color.primary : color.ink}
            fill={saved ? color.primary : "transparent"}
          />
        </IconButton>
      </View>

      <InsightCallout body={outfit.reason} className="mt-6" />

      <SectionHeader title="The Breakdown" index="01" className="mt-8" />
      <OutfitBreakdown items={outfit.items} />

      <Button
        label={saved ? "Saved to Outfits" : "Save This Outfit"}
        variant={saved ? "outline" : "primary"}
        onPress={() => toggleSave(outfit)}
        className="mb-2 mt-8"
      />
    </ScreenContainer>
  );
}
