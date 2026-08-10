import { router } from "expo-router";
import { Briefcase, Coffee, Martini, Presentation, Sun } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SelectCard } from "@/components/ui/select-card";
import { OUTFIT_CONTEXTS } from "@/constants/mock-outfits";

const CONTEXT_ICONS: Record<string, typeof Coffee> = {
  coffee: Coffee,
  briefcase: Briefcase,
  martini: Martini,
  presentation: Presentation,
  sun: Sun,
};

export default function GenerateHomeScreen() {
  const [context, setContext] = useState<string | null>(null);

  return (
    <ScreenContainer scroll>
      <View className="flex-row items-center justify-between pt-6">
        <Text className="text-2xl font-bold tracking-tight text-ink">Outfit Generator</Text>
        <Text
          onPress={() => router.push("/generate/saved")}
          suppressHighlighting
          className="text-sm font-semibold text-clay active:opacity-70"
        >
          Saved
        </Text>
      </View>
      <Text className="mt-2 text-base text-muted">
        Tell us the vibe and we&apos;ll style a look from your closet.
      </Text>

      <View className="mt-8 gap-3">
        {OUTFIT_CONTEXTS.map((option) => {
          const Icon = CONTEXT_ICONS[option.icon] ?? Coffee;
          const selected = context === option.key;
          return (
            <SelectCard
              key={option.key}
              label={option.label}
              selected={selected}
              onPress={() => setContext(option.key)}
              icon={<Icon size={22} color={selected ? "#FAF8F5" : "#1A1917"} />}
            />
          );
        })}
      </View>

      <Button
        label="Generate Outfit"
        disabled={!context}
        onPress={() => router.push(`/generate/result?context=${encodeURIComponent(context ?? "")}`)}
        className="mb-2 mt-10"
      />
    </ScreenContainer>
  );
}
