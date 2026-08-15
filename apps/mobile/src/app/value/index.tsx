import { router } from "expo-router";
import { ArrowDownWideNarrow, Sparkles, TrendingUp } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Header } from "@/components/ui/header";
import { InsightCallout } from "@/components/ui/insight-callout";
import { PageHeading } from "@/components/ui/page-heading";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { StatTile } from "@/components/ui/stat-tile";
import { Tag } from "@/components/ui/tag";
import { CLOSET_CATEGORIES } from "@/constants/mock-closet";
import { VALUED_ITEMS, costPerWear, formatMoney } from "@/constants/mock-value";
import { color } from "@/design";

type SortKey = "value" | "cpw" | "wears";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "value", label: "Most valuable" },
  { key: "cpw", label: "Best per wear" },
  { key: "wears", label: "Most worn" },
];

export default function ClosetValueScreen() {
  const [sort, setSort] = useState<SortKey>("value");

  const totals = useMemo(() => {
    const total = VALUED_ITEMS.reduce((sum, item) => sum + item.value, 0);
    const wears = VALUED_ITEMS.reduce((sum, item) => sum + item.wears, 0);
    return {
      total,
      average: total / VALUED_ITEMS.length,
      wears,
      blendedCpw: total / Math.max(1, wears),
    };
  }, []);

  const sorted = useMemo(() => {
    const copy = [...VALUED_ITEMS];
    if (sort === "value") return copy.sort((a, b) => b.value - a.value);
    if (sort === "wears") return copy.sort((a, b) => b.wears - a.wears);
    return copy.sort((a, b) => costPerWear(a) - costPerWear(b));
  }, [sort]);

  // The pieces quietly costing the most per wear are the interesting story.
  const underused = useMemo(
    () => [...VALUED_ITEMS].sort((a, b) => costPerWear(b) - costPerWear(a)).slice(0, 3),
    []
  );

  return (
    <ScreenContainer scroll>
      <Header title="Closet Value" />

      <PageHeading eyebrow="What it's worth" title="Your closet, valued" />

      <View className="mt-2xl items-center">
        <Text className="text-eyebrow font-semibold uppercase text-text-muted">Total value</Text>
        <Text className="mt-sm text-display font-bold text-primary-500">
          {formatMoney(totals.total)}
        </Text>
        <Text className="mt-1 text-caption text-text-muted">
          Based on current market prices · {VALUED_ITEMS.length} tracked pieces
        </Text>
      </View>

      <View className="mt-md flex-row gap-md">
        <StatTile
          label="Avg. piece"
          value={formatMoney(totals.average)}
          className="flex-1"
        />
        <StatTile
          label="Blended cost/wear"
          value={formatMoney(totals.blendedCpw, 2)}
          hint={`${totals.wears} total wears`}
          tone="primary"
          className="flex-1"
        />
      </View>

      <SectionHeader
        title="Every piece"
        index="01"
        action={<ArrowDownWideNarrow size={16} color={color.textMuted} />}
        className="mt-3xl"
      />
      <View className="mb-md flex-row flex-wrap gap-sm">
        {SORTS.map((entry) => (
          <Chip
            key={entry.key}
            label={entry.label}
            selected={sort === entry.key}
            onPress={() => setSort(entry.key)}
            compact
          />
        ))}
      </View>

      <View className="gap-sm">
        {sorted.map((item) => {
          const cpw = costPerWear(item);
          const categoryLabel = CLOSET_CATEGORIES.find((c) => c.key === item.category)?.label;

          return (
            <Card key={item.id} className="flex-row items-center gap-md p-md">
              <GarmentSwatch
                category={item.category}
                colorHex={item.colorHex}
                className="h-14 w-14 overflow-hidden rounded-md"
                iconSize={20}
              />
              <View className="flex-1">
                <Text className="text-body font-semibold text-text-primary" numberOfLines={1}>
                  {item.label}
                </Text>
                <Text className="mt-0.5 text-caption text-text-muted">
                  {categoryLabel} · {item.wears} wears
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-body font-bold text-text-primary">{formatMoney(item.value)}</Text>
                <Text
                  className={`mt-0.5 text-caption font-semibold ${
                    cpw <= 3 ? "text-success" : cpw <= 8 ? "text-text-muted" : "text-danger"
                  }`}
                >
                  {formatMoney(cpw, 2)}/wear
                </Text>
              </View>
            </Card>
          );
        })}
      </View>

      <SectionHeader
        title="Costing you most"
        index="02"
        subtitle="High value, low wear — either start wearing them or move them on."
        className="mt-3xl"
      />
      <View className="gap-sm">
        {underused.map((item) => (
          <Card key={item.id} className="flex-row items-center gap-md p-md">
            <GarmentSwatch
              category={item.category}
              colorHex={item.colorHex}
              className="h-12 w-12 overflow-hidden rounded-md"
              iconSize={18}
            />
            <View className="flex-1">
              <Text className="text-body font-medium text-text-primary" numberOfLines={1}>
                {item.label}
              </Text>
              <Text className="mt-0.5 text-caption text-text-muted">{item.wears} wears</Text>
            </View>
            <Tag label={`${formatMoney(costPerWear(item), 2)}/wear`} tone="danger" />
          </Card>
        ))}
      </View>

      <InsightCallout
        title="Worth knowing"
        body="Your best-value piece is the white sneakers at well under a dollar per wear. The slip dress is the opposite — one more outing a month would halve its cost per wear."
        icon={TrendingUp}
        className="mt-2xl"
      />

      <Button
        label="Style an Underused Piece"
        icon={<Sparkles size={17} color={color.white} />}
        onPress={() => router.push("/generate")}
        className="mb-sm mt-3xl"
      />
    </ScreenContainer>
  );
}
