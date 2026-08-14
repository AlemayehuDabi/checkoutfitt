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

      <View className="items-center pt-2">
        <Text className="text-micro font-bold uppercase text-primary">Your capsule</Text>
        <Text className="mt-2 text-display-lg font-bold text-ink">{capsule.combinations}</Text>
        <Text className="mt-1 text-body-lg font-medium text-muted">distinct outfits</Text>
        <Text className="mt-3 px-4 text-center text-body leading-6 text-muted">
          From {capsule.itemCount} pieces — that&apos;s{" "}
          {Math.round(capsule.combinations / capsule.itemCount)} outfits per item you own.
        </Text>
      </View>

      <View className="mt-7 flex-row gap-3">
        <StatTile label="Pieces" value={`${capsule.itemCount}`} className="flex-1" />
        <StatTile
          label="Combinations"
          value={`${capsule.combinations}`}
          tone="primary"
          className="flex-1"
        />
      </View>

      <View className="mt-3 flex-row flex-wrap gap-2">
        {capsule.occasions.map((occasion) => (
          <Tag key={occasion} label={occasion} />
        ))}
      </View>

      <SectionHeader title="Coverage" index="01" className="mt-9" />
      <Card className="gap-5 p-5">
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
        className="mt-9"
      />
      <View className="flex-row flex-wrap gap-x-[4%] gap-y-4">
        {capsule.items.map((item) => {
          const categoryLabel = CLOSET_CATEGORIES.find((c) => c.key === item.category)?.label;
          return (
            <View key={item.id} className="w-[22%]">
              <GarmentSwatch
                category={item.category}
                colorHex={item.colorHex}
                className="aspect-square w-full overflow-hidden rounded-2xl"
                iconSize={22}
              />
              <Text className="mt-2 text-caption font-medium text-ink" numberOfLines={2}>
                {item.label}
              </Text>
              <Text className="text-micro uppercase text-faint">{categoryLabel}</Text>
            </View>
          );
        })}
      </View>

      <InsightCallout
        title="How to use it"
        body="Live out of this set for a fortnight. Anything you reach past three times is a gap; anything you never touch is a candidate to sell."
        icon={Sparkles}
        className="mt-8"
      />

      <Button
        label="Plan These Into Your Week"
        icon={<CalendarDays size={17} color={color.white} />}
        onPress={() => router.push("/calendar")}
        className="mt-8"
      />
      <Button
        label="Adjust the Constraints"
        variant="outline"
        onPress={() => router.back()}
        className="mb-2 mt-2"
      />
    </ScreenContainer>
  );
}
