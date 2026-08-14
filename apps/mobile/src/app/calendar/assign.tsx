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

      <Text className="text-h2 font-bold text-ink">Plan this day</Text>
      <Text className="mt-2 text-body text-muted">
        Choose a saved look, or generate one for the occasion.
      </Text>

      <Input
        label="Note (optional)"
        placeholder="Client review, dinner, flight…"
        value={note}
        onChangeText={setNote}
        autoCapitalize="sentences"
        containerClassName="mt-6"
      />

      <SectionHeader title="Generate for an occasion" index="01" className="mt-8" />
      <View className="flex-row flex-wrap gap-2">
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

      <Card className="mt-4 p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Tag label={suggestion.context} tone="primary" />
            <Text className="mt-2 text-h3 font-bold text-ink">{suggestion.title}</Text>
          </View>
          <Sparkles size={18} color={color.primary} />
        </View>
        <View className="mt-4 flex-row gap-2">
          {suggestion.items.slice(0, 4).map((item) => (
            <GarmentSwatch
              key={item.id}
              category={item.category}
              colorHex={item.colorHex}
              className="aspect-square flex-1 overflow-hidden rounded-xl"
              iconSize={18}
            />
          ))}
        </View>
        <Button label="Assign This Look" className="mt-4" onPress={() => handleAssign(suggestion)} />
      </Card>

      <SectionHeader title="From your saved outfits" index="02" className="mt-9" />
      {savedOutfits.length ? (
        <View className="gap-2.5">
          {savedOutfits.map((outfit) => (
            <Card key={outfit.id} onPress={() => handleAssign(outfit)} className="p-4">
              <View className="flex-row items-center gap-3">
                <View className="flex-1">
                  <Tag label={outfit.context} />
                  <Text className="mt-2 text-body font-semibold text-ink">{outfit.title}</Text>
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
        <Card tone="sunken" className="p-5">
          <Text className="text-body-sm leading-5 text-muted">
            You haven&apos;t saved any outfits yet. Generate one above, or save looks from the
            Generate tab to plan them here later.
          </Text>
        </Card>
      )}
    </ScreenContainer>
  );
}
