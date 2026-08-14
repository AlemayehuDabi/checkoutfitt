import { router, useLocalSearchParams } from "expo-router";
import { Check, CloudSun, Luggage } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { InsightCallout } from "@/components/ui/insight-callout";
import { Meter } from "@/components/ui/meter";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { StatTile } from "@/components/ui/stat-tile";
import { generatePackingList } from "@/constants/mock-packing";
import { color } from "@/design";
import { shortDate, toISODate } from "@/lib/date";
import { PressableScale } from "@/components/ui/pressable-scale";

export default function PackingResultScreen() {
  const { destination, startDate, purpose } = useLocalSearchParams<{
    destination?: string;
    startDate?: string;
    purpose?: string;
  }>();

  const list = useMemo(
    () =>
      generatePackingList(
        destination || "Your trip",
        startDate || toISODate(new Date()),
        purpose || "Business"
      ),
    [destination, startDate, purpose]
  );

  const [packed, setPacked] = useState<Set<string>>(new Set());

  const totalItems = list.categories.reduce((sum, group) => sum + group.items.length, 0);
  const packedCount = packed.size;

  const togglePacked = (id: string) => {
    setPacked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ScreenContainer scroll>
      <Header title="Packing List" />

      <Text className="text-micro font-bold uppercase text-primary">
        {shortDate(list.startDate)} — {shortDate(list.endDate)}
      </Text>
      <Text className="mt-2 text-display font-bold text-ink">{list.destination}</Text>

      <InsightCallout
        title="Forecast"
        body={list.weatherNote}
        icon={CloudSun}
        tone="info"
        className="mt-5"
      />

      <View className="mt-3 flex-row gap-3">
        <StatTile label="Pieces" value={`${totalItems}`} className="flex-1" />
        <StatTile
          label="Days covered"
          value={`${list.outfitPlan.length}`}
          tone="primary"
          className="flex-1"
        />
      </View>

      <SectionHeader title="Outfit plan" index="01" className="mt-9" />
      <View className="gap-2.5">
        {list.outfitPlan.map((day) => (
          <Card key={day.day} className="p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-micro font-semibold uppercase text-muted">
                {shortDate(day.day)}
              </Text>
              <Text className="text-caption font-semibold text-primary">{day.label}</Text>
            </View>
            <View className="mt-3 flex-row gap-2">
              {day.items.map((item) => (
                <GarmentSwatch
                  key={`${day.day}-${item.id}`}
                  category={item.category}
                  colorHex={item.colorHex}
                  className="aspect-square flex-1 overflow-hidden rounded-xl"
                  iconSize={18}
                />
              ))}
            </View>
          </Card>
        ))}
      </View>

      <SectionHeader
        title="The checklist"
        index="02"
        subtitle="Tap to tick items off as you pack."
        className="mt-9"
      />

      <Card className="mb-3 p-5">
        <Meter
          label="Packed"
          value={packedCount}
          max={totalItems}
          valueLabel={`${packedCount} / ${totalItems}`}
        />
      </Card>

      <View className="gap-3">
        {list.categories.map((group) => (
          <Card key={group.label} className="px-4 py-2">
            <Text className="py-2.5 text-micro font-semibold uppercase text-muted">
              {group.label}
            </Text>
            {group.items.map((item, index) => {
              const isPacked = packed.has(item.id);
              return (
                <View key={item.id}>
                  {index > 0 ? <View className="h-px bg-line" /> : null}
                  <PressableScale
                    onPress={() => togglePacked(item.id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isPacked }}
                    className="flex-row items-center gap-3 py-3.5"
                  >
                    <View
                      className={`h-5 w-5 items-center justify-center rounded-md border ${
                        isPacked ? "border-primary bg-primary" : "border-line-strong"
                      }`}
                    >
                      {isPacked ? <Check size={13} color={color.white} strokeWidth={3} /> : null}
                    </View>
                    <Text
                      className={`flex-1 text-body ${
                        isPacked ? "text-muted line-through" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {item.qty > 1 ? (
                      <Text className="text-caption font-semibold text-muted">×{item.qty}</Text>
                    ) : null}
                  </PressableScale>
                </View>
              );
            })}
          </Card>
        ))}
      </View>

      <Button
        label="Plan Another Trip"
        variant="outline"
        icon={<Luggage size={17} color={color.ink} />}
        onPress={() => router.replace("/packing")}
        className="mb-2 mt-8"
      />
    </ScreenContainer>
  );
}
