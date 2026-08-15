import { router, useLocalSearchParams } from "expo-router";
import { Check, Shirt, Sparkles, X } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { InsightCallout } from "@/components/ui/insight-callout";
import { PageHeading } from "@/components/ui/page-heading";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { StatTile } from "@/components/ui/stat-tile";
import { COLOR_SEASON } from "@/constants/mock-color-analysis";
import { color } from "@/design";
import { AppImage } from "@/components/ui/app-image";

/** A colour chip that names itself — used for both the best and avoid sets. */
function Swatch({ name, hex, muted }: { name: string; hex: string; muted?: boolean }) {
  return (
    <View className="w-[22%] items-center">
      <View
        className={`aspect-square w-full rounded-md border ${
          muted ? "border-border opacity-45" : "border-border"
        }`}
        style={{ backgroundColor: hex }}
      />
      <Text className="mt-sm text-eyebrow font-medium uppercase text-text-muted" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

export default function ColorResultScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const season = COLOR_SEASON;

  return (
    <ScreenContainer scroll>
      <Header title="Your Colours" />

      <View className="flex-row items-center gap-lg">
        {uri ? (
          <View className="h-20 w-20 overflow-hidden rounded-full border-2 border-border">
            <AppImage source={{ uri }} className="h-full w-full" contentFit="cover" />
          </View>
        ) : null}
        <PageHeading eyebrow="Your palette" title={season.season} className="flex-1" />
      </View>

      <View className="mt-2xl flex-row gap-md">
        <StatTile label="Undertone" value={season.undertone} className="flex-1" />
        <StatTile label="Contrast" value={season.contrast} className="flex-1" />
      </View>

      <InsightCallout title="What this means" body={season.summary} className="mt-md" />

      <SectionHeader
        title="Your colours"
        index="01"
        subtitle="These read as deliberate on you — build your core around them."
        className="mt-3xl"
      />
      <View className="flex-row flex-wrap gap-x-[4%] gap-y-lg">
        {season.best.map((entry) => (
          <Swatch key={entry.hex} name={entry.name} hex={entry.hex} />
        ))}
      </View>

      <SectionHeader
        title="Wear sparingly"
        index="02"
        subtitle="Not banned — just keep them away from your face."
        className="mt-3xl"
      />
      <View className="flex-row flex-wrap gap-x-[4%] gap-y-lg">
        {season.avoid.map((entry) => (
          <Swatch key={entry.hex} name={entry.name} hex={entry.hex} muted />
        ))}
      </View>

      <SectionHeader title="Details" index="03" className="mt-3xl" />
      <Card className="p-xl">
        <View className="flex-row items-start gap-sm">
          <Check size={15} color={color.success} strokeWidth={2.5} />
          <Text className="flex-1 text-body-sm text-text-secondary">
            <Text className="font-semibold text-text-primary">Metals: </Text>
            {season.metals}
          </Text>
        </View>
        <View className="mt-md flex-row items-start gap-sm">
          <X size={15} color={color.danger} strokeWidth={2.5} />
          <Text className="flex-1 text-body-sm text-text-secondary">
            <Text className="font-semibold text-text-primary">Near your face: </Text>
            keep the cool, icy tones to bags, shoes and outerwear linings.
          </Text>
        </View>
      </Card>

      <Button
        label="Generate an Outfit in These Colours"
        icon={<Sparkles size={17} color={color.white} />}
        onPress={() => router.push("/generate")}
        className="mt-3xl"
      />
      <Button
        label="Review My Closet"
        variant="outline"
        icon={<Shirt size={17} color={color.textPrimary} />}
        onPress={() => router.push("/closet")}
        className="mb-sm mt-sm"
      />
    </ScreenContainer>
  );
}
