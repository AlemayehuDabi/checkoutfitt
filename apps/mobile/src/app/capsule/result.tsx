import { router, useLocalSearchParams } from "expo-router";
import { CalendarDays, Sparkles } from "lucide-react-native";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { InsightCallout } from "@/components/ui/insight-callout";
import { Meter } from "@/components/ui/meter";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { StatTile } from "@/components/ui/stat-tile";
import { Tag } from "@/components/ui/tag";
import { CLOSET_CATEGORIES } from "@/constants/mock-closet";
import { generateCapsule } from "@/constants/mock-capsule";
import { color } from "@/design";

export default function CapsuleResultScreen() {
  const { size, occasions } = useLocalSearchParams<{ size?: string; occasions?: string }>();

  const itemCount = Number(size) || 12;
  const selectedOccasions = useMemo(
    () => (occasions ? occasions.split(",").filter(Boolean) : ["Everyday"]),
    [occasions]
  );

  const capsule = useMemo(
    () => generateCapsule(itemCount, selectedOccasions),
    [itemCount, selectedOccasions]
  );

  return (
    <ScreenContainer scroll>
      <Header title="Your Capsule" />

      <View className="items-center pt-sm">
        <Text className="text-eyebrow font-semibold uppercase text-text-muted">Your capsule</Text>
        <Text className="mt-sm text-display font-bold text-primary-500">{capsule.combinations}</Text>
        <Text className="mt-1 text-body font-medium text-text-muted">distinct outfits</Text>
        <Text className="mt-md px-lg text-center text-body text-text-muted">
          From {capsule.itemCount} pieces — that&apos;s{" "}
          {Math.round(capsule.combinations / capsule.itemCount)} outfits per item you own.
        </Text>
      </View>

      <View className="mt-2xl flex-row gap-md">
        <StatTile label="Pieces" value={`${capsule.itemCount}`} className="flex-1" />
        <StatTile
          label="Combinations"
          value={`${capsule.combinations}`}
          tone="primary"
          className="flex-1"
        />
      </View>

      <View className="mt-md flex-row flex-wrap gap-sm">
        {capsule.occasions.map((occasion) => (
          <Tag key={occasion} label={occasion} />
        ))}
      </View>

      <SectionHeader title="Coverage" index="01" className="mt-3xl" />
      <Card className="gap-xl p-xl">
        {capsule.coverage.map((entry) => (
          <Meter
            key={entry.label}
            label={entry.label}
            value={entry.score}
            valueLabel={`${entry.score}%`}
          />
        ))}
      </Card>

      <SectionHeader
        title="The set"
        index="02"
        subtitle="Every piece earns its place by pairing with most of the others."
        className="mt-3xl"
      />
      <View className="flex-row flex-wrap gap-x-[4%] gap-y-lg">
        {capsule.items.map((item) => {
          const categoryLabel = CLOSET_CATEGORIES.find((c) => c.key === item.category)?.label;
          return (
            <View key={item.id} className="w-[22%]">
              <GarmentSwatch
                category={item.category}
                colorHex={item.colorHex}
                className="aspect-square w-full overflow-hidden rounded-md"
                iconSize={22}
              />
              <Text className="mt-sm text-caption font-medium text-text-primary" numberOfLines={2}>
                {item.label}
              </Text>
              <Text className="text-eyebrow uppercase text-faint">{categoryLabel}</Text>
            </View>
          );
        })}
      </View>

      <InsightCallout
        title="How to use it"
        body="Live out of this set for a fortnight. Anything you reach past three times is a gap; anything you never touch is a candidate to sell."
        icon={Sparkles}
        className="mt-3xl"
      />

      <Button
        label="Plan These Into Your Week"
        icon={<CalendarDays size={17} color={color.white} />}
        onPress={() => router.push("/calendar")}
        className="mt-3xl"
      />
      <Button
        label="Adjust the Constraints"
        variant="outline"
        onPress={() => router.back()}
        className="mb-sm mt-sm"
      />
    </ScreenContainer>
  );
}
