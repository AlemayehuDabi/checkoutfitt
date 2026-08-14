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

      <Card tone="inverse" hero raise="lg" className="mt-7 flex-row items-center gap-4 p-6">
        <View className="h-14 w-14 items-center justify-center rounded-3xl bg-white/15">
          <SquareStack size={24} color={color.canvas} strokeWidth={1.5} />
        </View>
        <Text className="flex-1 text-body leading-6 text-canvas">
          A well-chosen capsule of {size} pieces usually beats a closet three times the size.
        </Text>
      </Card>

      <SectionHeader title="How many pieces" index="01" className="mt-9" />
      <View className="flex-row gap-2.5">
        {CAPSULE_SIZES.map((option) => (
          <Card
            key={option}
            onPress={() => setSize(option)}
            tone={size === option ? "inverse" : "surface"}
            className="flex-1 items-center py-4"
          >
            <Text
              className={`text-h2 font-bold ${size === option ? "text-canvas" : "text-ink"}`}
            >
              {option}
            </Text>
            <Text
              className={`mt-0.5 text-micro font-semibold uppercase ${
                size === option ? "text-faint" : "text-muted"
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
        className="mt-9"
      />
      <View className="flex-row flex-wrap gap-2">
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
        className="mb-2 mt-9"
      />
    </ScreenContainer>
  );
}
