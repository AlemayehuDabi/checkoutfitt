import { router, useLocalSearchParams } from "expo-router";
import { ShoppingBag, Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { ImageMatch } from "@/components/ui/image-match";
import { InsightCallout } from "@/components/ui/insight-callout";
import { ScoreDial } from "@/components/ui/score-dial";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/tag";
import { RECREATION_MATCHES, RECREATION_SUMMARY } from "@/constants/mock-recreation";
import { color } from "@/design";

export default function RecreateResultScreen() {
  const { uri, source } = useLocalSearchParams<{ uri?: string; source?: string }>();

  return (
    <ScreenContainer scroll>
      <Header title="Your Version" />

      <View className="items-center pt-sm">
        {source ? <Tag label={source} tone="primary" /> : null}
        <ScoreDial
          score={RECREATION_SUMMARY.overall}
          label="Match"
          size={168}
          className="mt-lg"
        />
        <Text className="mt-xl text-h2 font-bold text-text-primary">{RECREATION_SUMMARY.headline}</Text>
        <Text className="mt-sm px-sm text-center text-body-lg text-text-muted">
          {RECREATION_SUMMARY.body}
        </Text>
      </View>

      <SectionHeader
        title="Piece by piece"
        index="01"
        subtitle="What the reference uses, and the closest thing you already own."
        className="mt-3xl"
      />

      <View className="gap-sm">
        {RECREATION_MATCHES.map((match) => (
          <ImageMatch
            key={match.id}
            sourceUri={uri || undefined}
            sourceLabel={match.inspoLabel}
            target={
              <GarmentSwatch
                category={match.ownedItem.category}
                colorHex={match.ownedItem.colorHex}
                className="h-full w-full"
                iconSize={26}
              />
            }
            targetLabel={match.ownedItem.label}
            targetMeta={match.note}
            match={match.match}
          />
        ))}
      </View>

      <SectionHeader title="To nail it" index="02" className="mt-3xl" />
      <InsightCallout
        title="One piece short"
        body={`${RECREATION_SUMMARY.missing} — everything else you can wear tomorrow.`}
        icon={Sparkles}
      />

      <Button
        label="Check a Purchase"
        icon={<ShoppingBag size={17} color={color.white} />}
        onPress={() => router.push("/shopping")}
        className="mt-3xl"
      />
      <Button
        label="Try Another Reference"
        variant="outline"
        onPress={() => router.replace("/recreate")}
        className="mb-sm mt-sm"
      />
    </ScreenContainer>
  );
}
