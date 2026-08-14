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
      <View className="flex-row items-center justify-between pt-6">
        <Text className="text-2xl font-bold text-ink">Outfit Generator</Text>
        <Text
          onPress={() => router.push("/generate/saved")}
          suppressHighlighting
          className="text-sm font-semibold text-primary active:opacity-70"
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
              icon={<Icon size={22} color={selected ? color.canvas : color.ink} />}
            />
          );
        })}
      </View>

      <Button
        label="Generate Outfit"
        disabled={!context}
        onPress={() => router.push(`/generate/result?context=${encodeURIComponent(context ?? "")}`)}
        className="mt-10"
      />

      <SectionHeader title="Other ways in" className="mt-9" />
      <View className="mb-2 gap-2.5">
        <Card onPress={() => router.push("/occasions")} className="flex-row items-center gap-4 p-4">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-50">
            <PartyPopper size={19} color={color.primary} strokeWidth={1.75} />
          </View>
          <View className="flex-1">
            <Text className="text-body font-semibold text-ink">Shop by Occasion</Text>
            <Text className="mt-0.5 text-caption text-muted">
              Interviews, weddings, gym days, and more
            </Text>
          </View>
          <ChevronRight size={18} color={color.faint} />
        </Card>

        <Card onPress={() => router.push("/calendar")} className="flex-row items-center gap-4 p-4">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-50">
            <CalendarDays size={19} color={color.primary} strokeWidth={1.75} />
          </View>
          <View className="flex-1">
            <Text className="text-body font-semibold text-ink">Plan Ahead</Text>
            <Text className="mt-0.5 text-caption text-muted">
              Assign looks to days on your calendar
            </Text>
          </View>
          <ChevronRight size={18} color={color.faint} />
        </Card>

        <Card onPress={() => router.push("/rating/capture")} className="flex-row items-center gap-4 p-4">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-50">
            <ScanLine size={19} color={color.primary} strokeWidth={1.75} />
          </View>
          <View className="flex-1">
            <Text className="text-body font-semibold text-ink">Rate What You&apos;re Wearing</Text>
            <Text className="mt-0.5 text-caption text-muted">
              Score an outfit on colour, fit and proportion
            </Text>
          </View>
          <ChevronRight size={18} color={color.faint} />
        </Card>
      </View>
    </ScreenContainer>
  );
}
