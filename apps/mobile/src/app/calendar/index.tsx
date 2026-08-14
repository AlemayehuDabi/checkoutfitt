import { router } from "expo-router";
import { CalendarPlus, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "@/components/ui/calendar-grid";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { ListRow } from "@/components/ui/list-row";
import { PageHeading } from "@/components/ui/page-heading";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/tag";
import { usePlanner } from "@/context/planner-context";
import { color } from "@/design";
import { shortDate, toISODate } from "@/lib/date";

export default function CalendarScreen() {
  const { planned, getPlan, clear, upcoming } = usePlanner();
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState(() => toISODate(new Date()));

  const plan = getPlan(selected);
  const markers = Object.fromEntries(Object.keys(planned).map((date) => [date, color.primary]));

  return (
    <ScreenContainer scroll>
      <Header title="Outfit Calendar" />

      <PageHeading
        eyebrow="Plan ahead"
        title="Your week, styled"
        subtitle="Assign looks to days so mornings are already decided."
      />

      <Card className="mt-6 p-4">
        <CalendarGrid
          month={month}
          onMonthChange={setMonth}
          selected={selected}
          onSelect={setSelected}
          markers={markers}
        />
      </Card>

      <SectionHeader title={shortDate(selected)} index="01" className="mt-9" />

      {plan ? (
        <Card className="p-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Tag label={plan.outfit.context} tone="primary" />
              <Text className="mt-2 text-h3 font-bold text-ink">{plan.outfit.title}</Text>
              {plan.note ? (
                <Text className="mt-1 text-caption text-muted">{plan.note}</Text>
              ) : null}
            </View>
          </View>

          <View className="mt-4 flex-row gap-2">
            {plan.outfit.items.slice(0, 4).map((item) => (
              <GarmentSwatch
                key={item.id}
                category={item.category}
                colorHex={item.colorHex}
                className="aspect-square flex-1 overflow-hidden rounded-xl"
                iconSize={18}
              />
            ))}
          </View>

          <View className="mt-4 flex-row gap-2.5">
            <Button
              label="Change"
              variant="outline"
              size="sm"
              className="flex-1"
              onPress={() => router.push({ pathname: "/calendar/assign", params: { date: selected } })}
            />
            <Button
              label="Remove"
              variant="ghost"
              size="sm"
              icon={<Trash2 size={15} color={color.danger} />}
              className="flex-1"
              onPress={() => clear(selected)}
            />
          </View>
        </Card>
      ) : (
        <Card tone="sunken" className="items-center p-6">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-surface">
            <CalendarPlus size={20} color={color.muted} strokeWidth={1.5} />
          </View>
          <Text className="mt-3 text-body font-semibold text-ink">Nothing planned</Text>
          <Text className="mt-1 text-center text-body-sm text-muted">
            Pick a look for {shortDate(selected)}.
          </Text>
          <Button
            label="Plan an Outfit"
            size="sm"
            className="mt-4"
            onPress={() => router.push({ pathname: "/calendar/assign", params: { date: selected } })}
          />
        </Card>
      )}

      {upcoming.length ? (
        <>
          <SectionHeader title="Coming up" index="02" className="mt-9" />
          <Card className="px-4">
            {upcoming.slice(0, 5).map((entry, index) => (
              <View key={entry.date}>
                {index > 0 ? <View className="h-px bg-line" /> : null}
                <ListRow
                  label={entry.outfit.title}
                  description={`${shortDate(entry.date)}${entry.note ? ` · ${entry.note}` : ""}`}
                  icon={
                    <GarmentSwatch
                      category={entry.outfit.items[0]?.category ?? "top"}
                      colorHex={entry.outfit.items[0]?.colorHex ?? color.surfaceMuted}
                      className="h-10 w-10 overflow-hidden rounded-xl"
                      iconSize={16}
                    />
                  }
                  onPress={() => {
                    setSelected(entry.date);
                    setMonth(new Date(entry.date));
                  }}
                />
              </View>
            ))}
          </Card>
        </>
      ) : null}
    </ScreenContainer>
  );
}
