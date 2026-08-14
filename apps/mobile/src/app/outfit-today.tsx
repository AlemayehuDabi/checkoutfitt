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

      <View className="mt-6">
        <OutfitGallery items={todayOutfit.items} />
      </View>

      <Text className="mt-6 text-h2 font-bold text-ink">{todayOutfit.title}</Text>

      <InsightCallout body={todayOutfit.reason} className="mt-4" />

      <SectionHeader title="The Breakdown" index="01" className="mt-8" />
      <OutfitBreakdown items={todayOutfit.items} />

      <Button
        label={saved ? "Saved to Outfits" : "Save This Outfit"}
        variant={saved ? "outline" : "primary"}
        onPress={() => toggleSave(todayOutfit)}
        className="mb-2 mt-8"
      />
    </ScreenContainer>
  );
}
