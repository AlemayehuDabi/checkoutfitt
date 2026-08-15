import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { CalendarGrid } from "@/components/ui/calendar-grid";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { TRIP_PURPOSES } from "@/constants/mock-packing";
import { color } from "@/design";
import { toISODate } from "@/lib/date";

export default function PackingInputScreen() {
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState<string>("Business");
  const [month, setMonth] = useState(() => new Date());
  const [startDate, setStartDate] = useState(() => toISODate(new Date()));

  return (
    <ScreenContainer scroll keyboardAware>
      <Header title="Travel Packing" />

      <PageHeading
        eyebrow="Pack smarter"
        title="What to bring"
        subtitle="Tell us where and when — we'll build a list that re-wears rather than over-packs."
      />

      <SectionHeader title="Where to" index="01" className="mt-3xl" />
      <Input
        label="Destination"
        placeholder="Lisbon, Portugal"
        value={destination}
        onChangeText={setDestination}
        autoCapitalize="words"
        icon={<MapPin size={17} color={color.textMuted} />}
      />

      <SectionHeader title="Trip type" index="02" className="mt-3xl" />
      <View className="flex-row flex-wrap gap-sm">
        {TRIP_PURPOSES.map((entry) => (
          <Chip
            key={entry}
            label={entry}
            selected={purpose === entry}
            onPress={() => setPurpose(entry)}
          />
        ))}
      </View>

      <SectionHeader title="Departure" index="03" className="mt-3xl" />
      <Card className="p-lg">
        <CalendarGrid
          month={month}
          onMonthChange={setMonth}
          selected={startDate}
          onSelect={setStartDate}
        />
      </Card>

      <Button
        label="Build My Packing List"
        disabled={!destination.trim()}
        onPress={() =>
          router.push({
            pathname: "/packing/result",
            params: { destination: destination.trim(), startDate, purpose },
          })
        }
        className="mb-sm mt-3xl"
      />
    </ScreenContainer>
  );
}
