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
        className={`aspect-square w-full rounded-2xl border ${
          muted ? "border-line opacity-45" : "border-line"
        }`}
        style={{ backgroundColor: hex }}
      />
      <Text className="mt-2 text-micro font-medium uppercase text-muted" numberOfLines={1}>
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

      <View className="flex-row items-center gap-4">
        {uri ? (
          <View className="h-20 w-20 overflow-hidden rounded-3xl border border-line">
            <AppImage source={{ uri }} className="h-full w-full" contentFit="cover" />
          </View>
        ) : null}
        <PageHeading eyebrow="Your palette" title={season.season} className="flex-1" />
      </View>

      <View className="mt-6 flex-row gap-3">
        <StatTile label="Undertone" value={season.undertone} className="flex-1" />
        <StatTile label="Contrast" value={season.contrast} className="flex-1" />
      </View>

      <InsightCallout title="What this means" body={season.summary} className="mt-3" />

      <SectionHeader
        title="Your colours"
        index="01"
        subtitle="These read as deliberate on you — build your core around them."
        className="mt-9"
      />
      <View className="flex-row flex-wrap gap-x-[4%] gap-y-4">
        {season.best.map((entry) => (
          <Swatch key={entry.hex} name={entry.name} hex={entry.hex} />
        ))}
      </View>

      <SectionHeader
        title="Wear sparingly"
        index="02"
        subtitle="Not banned — just keep them away from your face."
        className="mt-9"
      />
      <View className="flex-row flex-wrap gap-x-[4%] gap-y-4">
        {season.avoid.map((entry) => (
          <Swatch key={entry.hex} name={entry.name} hex={entry.hex} muted />
        ))}
      </View>

      <SectionHeader title="Details" index="03" className="mt-9" />
      <Card className="p-5">
        <View className="flex-row items-start gap-2.5">
          <Check size={15} color={color.success} strokeWidth={2.5} />
          <Text className="flex-1 text-body-sm leading-5 text-ink-soft">
            <Text className="font-semibold text-ink">Metals: </Text>
            {season.metals}
          </Text>
        </View>
        <View className="mt-3 flex-row items-start gap-2.5">
          <X size={15} color={color.danger} strokeWidth={2.5} />
          <Text className="flex-1 text-body-sm leading-5 text-ink-soft">
            <Text className="font-semibold text-ink">Near your face: </Text>
            keep the cool, icy tones to bags, shoes and outerwear linings.
          </Text>
        </View>
      </Card>

      <Button
        label="Generate an Outfit in These Colours"
        icon={<Sparkles size={17} color={color.white} />}
        onPress={() => router.push("/generate")}
        className="mt-8"
      />
      <Button
        label="Review My Closet"
        variant="outline"
        icon={<Shirt size={17} color={color.ink} />}
        onPress={() => router.push("/closet")}
        className="mb-2 mt-2"
      />
    </ScreenContainer>
  );
}
