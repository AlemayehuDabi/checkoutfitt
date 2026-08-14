import { router } from "expo-router";
import {
  CalendarDays,
  ChevronRight,
  MapPin,
  Shirt,
  Sparkles,
  Wand2,
} from "lucide-react-native";
import { type ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Card } from "@/components/ui/card";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/tag";
import { WeatherStrip } from "@/components/weather/weather-strip";
import { COACH_TIPS } from "@/constants/mock-style";
import { usePlanner } from "@/context/planner-context";
import { useWeather } from "@/context/weather-context";
import { color } from "@/design";
import { shortDate } from "@/lib/date";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { locationName, weather, todayOutfit } = useWeather();
  const { upcoming } = usePlanner();
  const featuredTip = COACH_TIPS.find((tip) => tip.featured);

  return (
    <ScreenContainer scroll edges={["top", "left", "right"]}>
      <View className="pt-6">
        <Text className="text-micro font-semibold uppercase text-muted">{getGreeting()}</Text>
        <Text className="mt-1.5 text-h1 font-bold text-ink">Welcome back</Text>
      </View>

      <View className="mt-6">
        {locationName ? (
          <WeatherStrip weather={weather} />
        ) : (
          <Card onPress={() => router.push("/location")} className="flex-row items-center gap-4 p-5">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-50">
              <MapPin size={20} color={color.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-body font-semibold text-ink">Set your location</Text>
              <Text className="mt-0.5 text-caption text-muted">
                Get outfit suggestions based on today&apos;s weather
              </Text>
            </View>
            <ChevronRight size={18} color={color.faint} />
          </Card>
        )}
      </View>

      <Pressable
        onPress={() => router.push("/outfit-today")}
        className="mt-6 rounded-3xl border border-line bg-surface p-5 active:opacity-90"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-micro font-bold uppercase text-primary">Today&apos;s Outfit</Text>
          <ChevronRight size={18} color={color.faint} />
        </View>
        <Text className="mt-1.5 text-h2 font-bold text-ink">{todayOutfit.title}</Text>
        <View className="mt-4 flex-row gap-2">
          {todayOutfit.items.slice(0, 4).map((item) => (
            <GarmentSwatch
              key={item.id}
              category={item.category}
              colorHex={item.colorHex}
              className="aspect-square flex-1 overflow-hidden rounded-xl"
              iconSize={18}
            />
          ))}
        </View>
      </Pressable>

      {upcoming.length ? (
        <>
          <SectionHeader
            title="Planned ahead"
            className="mt-9"
            action={
              <Pressable onPress={() => router.push("/calendar")} hitSlop={8}>
                <Text className="text-caption font-semibold text-primary">Calendar</Text>
              </Pressable>
            }
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2.5 pr-gutter"
            className="-mx-gutter px-gutter"
          >
            {upcoming.slice(0, 4).map((plan) => (
              <Card
                key={plan.date}
                onPress={() => router.push("/calendar")}
                className="w-44 p-3.5"
              >
                <Text className="text-micro font-semibold uppercase text-muted">
                  {shortDate(plan.date)}
                </Text>
                <Text className="mt-1.5 text-body font-semibold text-ink" numberOfLines={1}>
                  {plan.outfit.title}
                </Text>
                <View className="mt-3 flex-row gap-1.5">
                  {plan.outfit.items.slice(0, 4).map((item) => (
                    <GarmentSwatch
                      key={item.id}
                      category={item.category}
                      colorHex={item.colorHex}
                      className="aspect-square flex-1 overflow-hidden rounded-lg"
                      iconSize={13}
                    />
                  ))}
                </View>
              </Card>
            ))}
          </ScrollView>
        </>
      ) : null}

      {featuredTip ? (
        <Card
          tone="primary"
          onPress={() => router.push("/coach")}
          className="mt-9 p-5"
        >
          <View className="flex-row items-center gap-2">
            <Sparkles size={15} color={color.primary} />
            <Text className="text-micro font-bold uppercase text-primary">From your coach</Text>
          </View>
          <Text className="mt-2.5 text-body-lg font-semibold text-ink">{featuredTip.title}</Text>
          <Text className="mt-1.5 text-body-sm leading-5 text-ink-soft" numberOfLines={2}>
            {featuredTip.body}
          </Text>
          <View className="mt-3.5 flex-row items-center gap-1">
            <Text className="text-caption font-semibold text-primary-700">See your style profile</Text>
            <ChevronRight size={14} color={color.primary} />
          </View>
        </Card>
      ) : null}

      <SectionHeader title="Shortcuts" className="mt-9" />
      <View className="gap-2.5 pb-8">
        <Card
          tone="inverse"
          onPress={() => router.push("/studio")}
          raise="md"
          className="flex-row items-center gap-4 p-5"
        >
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Wand2 size={20} color={color.canvas} strokeWidth={1.75} />
          </View>
          <View className="flex-1">
            <Text className="text-body-lg font-semibold text-canvas">The Studio</Text>
            <Text className="mt-0.5 text-caption text-faint">
              Coaching, colour, gaps, planning & rating
            </Text>
          </View>
          <ChevronRight size={18} color={color.faint} />
        </Card>

        <View className="flex-row gap-2.5">
          <QuickAction
            icon={<Shirt size={19} color={color.ink} />}
            label="Browse Closet"
            onPress={() => router.push("/closet")}
          />
          <QuickAction
            icon={<Sparkles size={19} color={color.ink} />}
            label="Generate a Look"
            onPress={() => router.push("/generate")}
          />
        </View>
        <View className="flex-row gap-2.5">
          <QuickAction
            icon={<CalendarDays size={19} color={color.ink} />}
            label="Plan the Week"
            onPress={() => router.push("/calendar")}
          />
          <QuickAction
            icon={<Wand2 size={19} color={color.ink} />}
            label="Style Coach"
            onPress={() => router.push("/coach")}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} className="flex-1 items-start gap-3 p-4">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-sunken">
        {icon}
      </View>
      <Text className="text-body-sm font-semibold text-ink">{label}</Text>
    </Card>
  );
}
