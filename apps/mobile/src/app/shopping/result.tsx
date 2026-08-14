import { router, useLocalSearchParams } from "expo-router";
import { Check, CircleHelp, Sparkles, X } from "lucide-react-native";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { InsightCallout } from "@/components/ui/insight-callout";
import { Meter } from "@/components/ui/meter";
import { ProductCard } from "@/components/ui/product-card";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { StatTile } from "@/components/ui/stat-tile";
import {
  ALTERNATIVE_PRODUCTS,
  SAMPLE_PRODUCT,
  generateVerdict,
} from "@/constants/mock-shopping";
import { color } from "@/design";

const VERDICT_STYLE = {
  buy: { icon: Check, tone: "success" as const, chip: "bg-success-soft", text: "text-success" },
  maybe: {
    icon: CircleHelp,
    tone: "warning" as const,
    chip: "bg-warning-soft",
    text: "text-warning",
  },
  skip: { icon: X, tone: "danger" as const, chip: "bg-danger-soft", text: "text-danger" },
};

export default function ShoppingResultScreen() {
  const { price, uri } = useLocalSearchParams<{ price?: string; uri?: string }>();
  const priceValue = Number(price) || 128;

  const verdict = useMemo(() => generateVerdict(priceValue), [priceValue]);
  const style = VERDICT_STYLE[verdict.verdict];
  const VerdictIcon = style.icon;

  const product = {
    ...SAMPLE_PRODUCT,
    price: `$${priceValue}`,
    imageUri: uri || undefined,
  };

  return (
    <ScreenContainer scroll>
      <Header title="The Verdict" />

      <View className="items-center pt-2">
        <View className={`h-20 w-20 items-center justify-center rounded-4xl ${style.chip}`}>
          <VerdictIcon
            size={32}
            color={
              verdict.verdict === "buy"
                ? color.success
                : verdict.verdict === "maybe"
                  ? color.warning
                  : color.danger
            }
            strokeWidth={2}
          />
        </View>
        <Text className={`mt-5 text-display font-bold ${style.text}`}>{verdict.headline}</Text>
        <Text className="mt-3 px-2 text-center text-body-lg leading-6 text-muted">
          {verdict.reasoning}
        </Text>
      </View>

      <SectionHeader title="What you're buying" index="01" className="mt-9" />
      <ProductCard product={product} />

      <View className="mt-3 flex-row gap-3">
        <StatTile
          label="Outfits unlocked"
          value={`+${verdict.outfitsUnlocked}`}
          tone="primary"
          className="flex-1"
        />
        <StatTile
          label="Cost per wear"
          value={verdict.costPerWear}
          hint="Over a year"
          className="flex-1"
        />
      </View>

      <Card className="mt-3 p-5">
        <Meter
          label="Versatility with your closet"
          value={verdict.versatility}
          valueLabel={`${verdict.versatility}%`}
          hint="How much of what you own it pairs with cleanly."
        />
      </Card>

      <SectionHeader
        title="It would pair with"
        index="02"
        subtitle="Pieces already in your closet."
        className="mt-9"
      />
      <View className="gap-2.5">
        {verdict.pairsWith.map((item) => (
          <Card key={item.id} className="flex-row items-center gap-3 p-3">
            <GarmentSwatch
              category={item.category}
              colorHex={item.colorHex}
              className="h-12 w-12 overflow-hidden rounded-xl"
              iconSize={18}
            />
            <Text className="flex-1 text-body font-medium text-ink">{item.label}</Text>
          </Card>
        ))}
      </View>

      <SectionHeader title="Similar, cheaper" index="03" className="mt-9" />
      <View className="gap-2.5">
        {ALTERNATIVE_PRODUCTS.map((alt) => (
          <ProductCard key={alt.id} product={alt} />
        ))}
      </View>

      <InsightCallout
        title="Before you decide"
        body="Give it 48 hours. If you can name three outfits you'd wear it in without thinking hard, it's a keeper."
        icon={Sparkles}
        className="mt-6"
      />

      <Button
        label="Check Something Else"
        variant="outline"
        onPress={() => router.replace("/shopping")}
        className="mb-2 mt-8"
      />
    </ScreenContainer>
  );
}
