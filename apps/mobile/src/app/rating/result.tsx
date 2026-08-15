import { router, useLocalSearchParams } from "expo-router";
import { ArrowUpRight, Camera, Sparkles } from "lucide-react-native";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Meter } from "@/components/ui/meter";
import { ScoreDial, toneForScore } from "@/components/ui/score-dial";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/tag";
import { generateRating } from "@/constants/mock-rating";
import { color } from "@/design";
import { AppImage } from "@/components/ui/app-image";

const VERDICT_TONE = {
  success: "success",
  primary: "primary",
  warning: "warning",
  danger: "danger",
} as const;

export default function RatingResultScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  // Seeded off the capture so re-shooting produces a visibly different read.
  const rating = useMemo(() => generateRating(uri ? uri.length : 0), [uri]);
  const tone = toneForScore(rating.overall);

  return (
    <ScreenContainer scroll>
      <Header title="Outfit Rating" />

      <View className="items-center pt-sm">
        <ScoreDial score={rating.overall} label="Overall" size={168} />
        <View className="mt-lg">
          <Tag label={rating.verdict} tone={VERDICT_TONE[tone]} />
        </View>
        <Text className="mt-lg px-sm text-center text-body-lg text-text-muted">
          {rating.summary}
        </Text>
      </View>

      {uri ? (
        <View className="mt-2xl flex-row gap-md">
          <View className="h-40 w-32 overflow-hidden rounded-lg border border-border">
            <AppImage source={{ uri }} className="h-full w-full" contentFit="cover" />
          </View>
          <Card tone="sunken" className="flex-1 justify-center p-lg">
            <Text className="text-eyebrow font-semibold uppercase text-text-muted">What we looked at</Text>
            <Text className="mt-sm text-body-sm text-text-secondary">
              Garment edges, drape, hem break, and how the colours sit against each other in this
              light.
            </Text>
          </Card>
        </View>
      ) : null}

      <SectionHeader title="The breakdown" index="01" className="mt-3xl" />
      <Card className="gap-xl p-xl">
        {rating.breakdown.map((entry) => (
          <Meter
            key={entry.label}
            label={entry.label}
            value={entry.score}
            valueLabel={`${entry.score}`}
            hint={entry.hint}
          />
        ))}
      </Card>

      <SectionHeader
        title="Make it sharper"
        index="02"
        subtitle="Three changes, in the order that will move the score most."
        className="mt-3xl"
      />
      <View className="gap-sm">
        {rating.improvements.map((item, index) => (
          <Card key={item} className="flex-row items-start gap-md p-lg">
            <View className="h-7 w-7 items-center justify-center rounded-full bg-primary-50">
              <Text className="text-eyebrow font-bold text-primary-700">{index + 1}</Text>
            </View>
            <Text className="flex-1 text-body-sm text-text-secondary">{item}</Text>
          </Card>
        ))}
      </View>

      <Card
        tone="primary"
        onPress={() => router.push("/coach")}
        className="mt-2xl flex-row items-center gap-md p-lg"
      >
        <Sparkles size={18} color={color.primary500} />
        <View className="flex-1">
          <Text className="text-body font-semibold text-primary-700">
            See how this fits your profile
          </Text>
          <Text className="mt-0.5 text-caption text-primary-600">
            Compare against your Modern Minimalist read
          </Text>
        </View>
        <ArrowUpRight size={18} color={color.primary500} />
      </Card>

      <Button
        label="Rate Another Outfit"
        icon={<Camera size={17} color={color.white} />}
        onPress={() => router.replace("/rating/capture")}
        className="mb-sm mt-3xl"
      />
    </ScreenContainer>
  );
}
