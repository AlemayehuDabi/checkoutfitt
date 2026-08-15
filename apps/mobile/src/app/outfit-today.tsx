import { Text, View } from "react-native";

import { OutfitBreakdown, OutfitGallery } from "@/components/outfit/outfit-breakdown";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { InsightCallout } from "@/components/ui/insight-callout";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { WeatherStrip } from "@/components/weather/weather-strip";
import { useOutfits } from "@/context/outfits-context";
import { useWeather } from "@/context/weather-context";

export default function OutfitTodayScreen() {
  const { weather, todayOutfit } = useWeather();
  const { toggleSave, isSaved } = useOutfits();
  const saved = isSaved(todayOutfit.id);

  return (
    <ScreenContainer scroll>
      <Header title="Today's Outfit" />

      <WeatherStrip weather={weather} />

      <View className="mt-2xl">
        <OutfitGallery items={todayOutfit.items} />
      </View>

      <Text className="mt-2xl text-h1 font-bold text-text-primary">{todayOutfit.title}</Text>

      <InsightCallout title="Why this outfit" body={todayOutfit.reason} className="mt-lg" />

      <SectionHeader title="Pieces" index="01" className="mt-3xl" />
      <OutfitBreakdown items={todayOutfit.items} />

      <Button
        label={saved ? "Saved to Outfits" : "Save This Outfit"}
        variant={saved ? "secondary" : "primary"}
        onPress={() => toggleSave(todayOutfit)}
        className="mb-sm mt-3xl"
      />
    </ScreenContainer>
  );
}
