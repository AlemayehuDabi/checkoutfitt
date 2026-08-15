import { router, useLocalSearchParams } from "expo-router";
import { CalendarX, Sparkles } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { StateView } from "@/components/ui/state-view";
import { Tag } from "@/components/ui/tag";
import { OUTFIT_CONTEXTS, generateOutfit } from "@/constants/mock-outfits";
import { useOutfits } from "@/context/outfits-context";
import { usePlanner } from "@/context/planner-context";
import { color } from "@/design";
import { shortDate } from "@/lib/date";
import type { Outfit } from "@/types";

export default function AssignOutfitScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { savedOutfits } = useOutfits();
  const { assign } = usePlanner();

  const [note, setNote] = useState("");
  const [context, setContext] = useState(OUTFIT_CONTEXTS[0].key);

  // A fresh suggestion per context, so there's always something to assign even
  // before the user has saved any outfits.
  const suggestion = useMemo<Outfit>(() => generateOutfit(context), [context]);

  const handleAssign = (outfit: Outfit) => {
    if (!date) return;
    assign(date, outfit, note.trim() || undefined);
    router.back();
  };

  if (!date) {
    return (
      <ScreenContainer>
        <Header title="Plan Outfit" />
        <StateView
          icon={CalendarX}
          title="No date selected"
          description="Pick a day on the calendar to plan a look for it."
          actionLabel="Back to Calendar"
          onAction={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Header title={shortDate(date)} />

      <Text className="text-h2 font-bold text-text-primary">Plan this day</Text>
      <Text className="mt-sm text-body text-text-muted">
        Choose a saved look, or generate one for the occasion.
      </Text>

      <Input
        label="Note (optional)"
        placeholder="Client review, dinner, flight…"
        value={note}
        onChangeText={setNote}
        autoCapitalize="sentences"
        containerClassName="mt-2xl"
      />

      <SectionHeader title="Generate for an occasion" index="01" className="mt-3xl" />
      <View className="flex-row flex-wrap gap-sm">
        {OUTFIT_CONTEXTS.map((entry) => (
          <Chip
            key={entry.key}
            label={entry.label}
            selected={context === entry.key}
            onPress={() => setContext(entry.key)}
            compact
          />
        ))}
      </View>

      <Card className="mt-lg p-lg">
        <View className="flex-row items-start justify-between gap-md">
          <View className="flex-1">
            <Tag label={suggestion.context} tone="primary" />
            <Text className="mt-sm text-h3 font-bold text-text-primary">{suggestion.title}</Text>
          </View>
          <Sparkles size={18} color={color.primary500} />
        </View>
        <View className="mt-lg flex-row gap-sm">
          {suggestion.items.slice(0, 4).map((item) => (
            <GarmentSwatch
              key={item.id}
              category={item.category}
              colorHex={item.colorHex}
              className="aspect-square flex-1 overflow-hidden rounded-sm"
              iconSize={18}
            />
          ))}
        </View>
        <Button label="Assign This Look" className="mt-lg" onPress={() => handleAssign(suggestion)} />
      </Card>

      <SectionHeader title="From your saved outfits" index="02" className="mt-3xl" />
      {savedOutfits.length ? (
        <View className="gap-sm">
          {savedOutfits.map((outfit) => (
            <Card key={outfit.id} onPress={() => handleAssign(outfit)} className="p-lg">
              <View className="flex-row items-center gap-md">
                <View className="flex-1">
                  <Tag label={outfit.context} />
                  <Text className="mt-sm text-body font-semibold text-text-primary">{outfit.title}</Text>
                </View>
                <View className="flex-row gap-1.5">
                  {outfit.items.slice(0, 3).map((item) => (
                    <GarmentSwatch
                      key={item.id}
                      category={item.category}
                      colorHex={item.colorHex}
                      className="h-10 w-10 overflow-hidden rounded-lg"
                      iconSize={14}
                    />
                  ))}
                </View>
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <Card tone="sunken" className="p-xl">
          <Text className="text-body-sm text-text-muted">
            You haven&apos;t saved any outfits yet. Generate one above, or save looks from the
            Generate tab to plan them here later.
          </Text>
        </Card>
      )}
    </ScreenContainer>
  );
}
