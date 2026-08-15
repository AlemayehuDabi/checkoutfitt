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
  const markers = Object.fromEntries(Object.keys(planned).map((date) => [date, color.primary500]));

  return (
    <ScreenContainer scroll>
      <Header title="Outfit Calendar" />

      <PageHeading
        eyebrow="Plan ahead"
        title="Your week, styled"
        subtitle="Assign looks to days so mornings are already decided."
      />

      <Card className="mt-2xl p-lg">
        <CalendarGrid
          month={month}
          onMonthChange={setMonth}
          selected={selected}
          onSelect={setSelected}
          markers={markers}
        />
      </Card>

      <SectionHeader title={shortDate(selected)} index="01" className="mt-3xl" />

      {plan ? (
        <Card className="p-lg">
          <View className="flex-row items-start justify-between gap-md">
            <View className="flex-1">
              <Tag label={plan.outfit.context} tone="primary" />
              <Text className="mt-sm text-h3 font-bold text-text-primary">{plan.outfit.title}</Text>
              {plan.note ? (
                <Text className="mt-1 text-caption text-text-muted">{plan.note}</Text>
              ) : null}
            </View>
          </View>

          <View className="mt-lg flex-row gap-sm">
            {plan.outfit.items.slice(0, 4).map((item) => (
              <GarmentSwatch
                key={item.id}
                category={item.category}
                colorHex={item.colorHex}
                className="aspect-square flex-1 overflow-hidden rounded-sm"
                iconSize={18}
              />
            ))}
          </View>

          <View className="mt-lg flex-row gap-sm">
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
        <Card tone="sunken" className="items-center p-2xl">
          <View className="h-12 w-12 items-center justify-center rounded-md bg-surface">
            <CalendarPlus size={20} color={color.textMuted} strokeWidth={1.5} />
          </View>
          <Text className="mt-md text-body font-semibold text-text-primary">Nothing planned</Text>
          <Text className="mt-1 text-center text-body-sm text-text-muted">
            Pick a look for {shortDate(selected)}.
          </Text>
          <Button
            label="Plan an Outfit"
            size="sm"
            className="mt-lg"
            onPress={() => router.push({ pathname: "/calendar/assign", params: { date: selected } })}
          />
        </Card>
      )}

      {upcoming.length ? (
        <>
          <SectionHeader title="Coming up" index="02" className="mt-3xl" />
          <Card className="px-lg">
            {upcoming.slice(0, 5).map((entry, index) => (
              <View key={entry.date}>
                {index > 0 ? <View className="h-px bg-border" /> : null}
                <ListRow
                  label={entry.outfit.title}
                  description={`${shortDate(entry.date)}${entry.note ? ` · ${entry.note}` : ""}`}
                  icon={
                    <GarmentSwatch
                      category={entry.outfit.items[0]?.category ?? "top"}
                      colorHex={entry.outfit.items[0]?.colorHex ?? color.surfaceTertiary}
                      className="h-10 w-10 overflow-hidden rounded-md"
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
