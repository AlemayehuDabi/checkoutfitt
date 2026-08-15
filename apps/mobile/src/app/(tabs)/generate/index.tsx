import { router } from "expo-router";
import {
  Briefcase,
  CalendarDays,
  ChevronRight,
  Coffee,
  Martini,
  PartyPopper,
  Presentation,
  ScanLine,
  Sun,
} from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { SelectCard } from "@/components/ui/select-card";
import { OUTFIT_CONTEXTS } from "@/constants/mock-outfits";

import { color } from "@/design";
import { IconWell } from "@/components/ui/icon-well";

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
    <ScreenContainer scroll edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between pt-2xl">
        <Text className="text-h1 font-bold text-text-primary">Outfit Generator</Text>
        <Text
          onPress={() => router.push("/generate/saved")}
          suppressHighlighting
          className="text-caption font-semibold text-text-accent active:opacity-70"
        >
          Saved
        </Text>
      </View>
      <Text className="mt-sm text-body text-text-muted">
        Tell us the vibe and we&apos;ll style a look from your closet.
      </Text>

      <View className="mt-3xl flex-row flex-wrap gap-md">
        {OUTFIT_CONTEXTS.map((option) => {
          const Icon = CONTEXT_ICONS[option.icon] ?? Coffee;
          const selected = context === option.key;
          return (
            <SelectCard
              key={option.key}
              label={option.label}
              selected={selected}
              onPress={() => setContext(option.key)}
              className="w-[48%]"
              icon={
                <Icon
                  size={24}
                  color={selected ? color.primary500 : color.textSecondary}
                  strokeWidth={1.75}
                />
              }
            />
          );
        })}
      </View>

      <Button
        label="Generate Outfit"
        disabled={!context}
        onPress={() => router.push(`/generate/result?context=${encodeURIComponent(context ?? "")}`)}
        className="mt-4xl"
      />

      <SectionHeader title="Other ways in" className="mt-3xl" />
      <View className="mb-sm gap-md">
        <Card onPress={() => router.push("/occasions")} className="flex-row items-center gap-lg p-lg">
          <IconWell size="md">
            <PartyPopper size={20} color={color.primary500} strokeWidth={1.75} />
          </IconWell>
          <View className="flex-1">
            <Text className="text-body font-medium text-text-primary">Shop by Occasion</Text>
            <Text className="mt-0.5 text-caption text-text-muted">
              Interviews, weddings, gym days, and more
            </Text>
          </View>
          <ChevronRight size={16} color={color.textMuted} />
        </Card>

        <Card onPress={() => router.push("/calendar")} className="flex-row items-center gap-lg p-lg">
          <IconWell size="md">
            <CalendarDays size={20} color={color.primary500} strokeWidth={1.75} />
          </IconWell>
          <View className="flex-1">
            <Text className="text-body font-medium text-text-primary">Plan Ahead</Text>
            <Text className="mt-0.5 text-caption text-text-muted">
              Assign looks to days on your calendar
            </Text>
          </View>
          <ChevronRight size={16} color={color.textMuted} />
        </Card>

        <Card onPress={() => router.push("/rating/capture")} className="flex-row items-center gap-lg p-lg">
          <IconWell size="md">
            <ScanLine size={20} color={color.primary500} strokeWidth={1.75} />
          </IconWell>
          <View className="flex-1">
            <Text className="text-body font-medium text-text-primary">Rate What You&apos;re Wearing</Text>
            <Text className="mt-0.5 text-caption text-text-muted">
              Score an outfit on colour, fit and proportion
            </Text>
          </View>
          <ChevronRight size={16} color={color.textMuted} />
        </Card>
      </View>
    </ScreenContainer>
  );
}
