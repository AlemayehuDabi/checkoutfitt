import { router } from "expo-router";
import { SquareStack } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Header } from "@/components/ui/header";
import { PageHeading } from "@/components/ui/page-heading";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { CAPSULE_OCCASIONS, CAPSULE_SIZES } from "@/constants/mock-capsule";
import { color } from "@/design";
import { IconWell } from "@/components/ui/icon-well";

export default function CapsuleInputScreen() {
  const [size, setSize] = useState<number>(12);
  const [occasions, setOccasions] = useState<string[]>(["Everyday", "Office"]);

  const toggleOccasion = (value: string) => {
    setOccasions((prev) =>
      prev.includes(value) ? prev.filter((entry) => entry !== value) : [...prev, value]
    );
  };

  return (
    <ScreenContainer scroll>
      <Header title="Capsule Wardrobe" />

      <PageHeading
        eyebrow="Build a capsule"
        title="Fewer pieces, more outfits"
        subtitle="Pick a size and what it needs to cover. We'll find the set that multiplies best."
      />

      <Card tone="sunken" className="mt-2xl flex-row items-center gap-lg p-lg">
        <IconWell size="lg" tone="primary">
          <SquareStack size={24} color={color.primary500} strokeWidth={1.5} />
        </IconWell>
        <Text className="flex-1 text-body text-text-secondary">
          A well-chosen capsule of {size} pieces usually beats a closet three times the size.
        </Text>
      </Card>

      <SectionHeader title="How many pieces" index="01" className="mt-3xl" />
      <View className="flex-row gap-sm">
        {CAPSULE_SIZES.map((option) => (
          <Card
            key={option}
            onPress={() => setSize(option)}
            tone={size === option ? "primary" : "surface"}
            className={`flex-1 items-center py-lg ${
              size === option ? "border border-primary-500" : ""
            }`}
          >
            <Text
              className={`text-stat font-bold ${
                size === option ? "text-primary-500" : "text-text-primary"
              }`}
            >
              {option}
            </Text>
            <Text
              className={`mt-0.5 text-eyebrow font-semibold uppercase ${
                size === option ? "text-primary-600" : "text-text-muted"
              }`}
            >
              pieces
            </Text>
          </Card>
        ))}
      </View>

      <SectionHeader
        title="What must it cover"
        index="02"
        subtitle="Pick every context this capsule has to handle."
        className="mt-3xl"
      />
      <View className="flex-row flex-wrap gap-sm">
        {CAPSULE_OCCASIONS.map((occasion) => (
          <Chip
            key={occasion}
            label={occasion}
            selected={occasions.includes(occasion)}
            onPress={() => toggleOccasion(occasion)}
          />
        ))}
      </View>

      <Button
        label="Build My Capsule"
        disabled={occasions.length === 0}
        onPress={() =>
          router.push({
            pathname: "/capsule/result",
            params: { size: String(size), occasions: occasions.join(",") },
          })
        }
        className="mb-sm mt-3xl"
      />
    </ScreenContainer>
  );
}
