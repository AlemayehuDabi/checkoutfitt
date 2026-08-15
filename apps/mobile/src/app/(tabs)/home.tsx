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
import { PressableScale } from "@/components/ui/pressable-scale";
import { ScreenContainer } from "@/components/ui/screen-container";
import { SectionHeader } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/tag";
import { WeatherStrip } from "@/components/weather/weather-strip";
import { COACH_TIPS } from "@/constants/mock-style";
import { usePlanner } from "@/context/planner-context";
import { useWeather } from "@/context/weather-context";
import { color, elevation, motion } from "@/design";
import { shortDate } from "@/lib/date";
import { IconWell } from "@/components/ui/icon-well";

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
      <View className="pt-2xl">
        {/* Spec screen 13: the greeting is the h2 that opens the screen. */}
        <Text className="text-h2 font-bold text-text-primary">{getGreeting()}</Text>
        <Text className="mt-1 text-caption text-text-muted">Welcome back</Text>
      </View>

      <View className="mt-2xl">
        {locationName ? (
          <WeatherStrip weather={weather} />
        ) : (
          <Card onPress={() => router.push("/location")} className="flex-row items-center gap-lg p-lg">
            <IconWell size="lg">
              <MapPin size={20} color={color.primary500} />
            </IconWell>
            <View className="flex-1">
              <Text className="text-h3 font-semibold text-text-primary">Set your location</Text>
              <Text className="mt-0.5 text-caption text-text-muted">
                Get outfit suggestions based on today&apos;s weather
              </Text>
            </View>
            <ChevronRight size={18} color={color.textMuted} />
          </Card>
        )}
      </View>

      {/* Today's Outfit reads as one large tappable hero card. */}
      <Card hero onPress={() => router.push("/outfit-today")} className="mt-2xl p-lg">
        <View className="flex-row items-center justify-between">
          <Text className="text-eyebrow font-semibold uppercase text-primary-500">
            Today&apos;s Outfit
          </Text>
          <ChevronRight size={18} color={color.textMuted} />
        </View>
        <Text className="mt-1.5 text-h2 font-bold text-text-primary">{todayOutfit.title}</Text>
        <View className="mt-lg flex-row gap-sm overflow-hidden rounded-lg bg-surface-secondary p-sm">
          {todayOutfit.items.slice(0, 4).map((item) => (
            <GarmentSwatch
              key={item.id}
              category={item.category}
              colorHex={item.colorHex}
              className="aspect-square flex-1 overflow-hidden rounded-sm"
              iconSize={18}
            />
          ))}
        </View>
      </Card>

      {upcoming.length ? (
        <>
          <SectionHeader
            title="Planned ahead"
            className="mt-3xl"
            action={
              <Pressable onPress={() => router.push("/calendar")} hitSlop={8}>
                <Text className="text-caption font-semibold text-text-accent">Calendar</Text>
              </Pressable>
            }
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-md pr-gutter"
            className="-mx-gutter px-gutter"
          >
            {upcoming.slice(0, 4).map((plan) => (
              <Card
                key={plan.date}
                onPress={() => router.push("/calendar")}
                className="w-44 p-lg"
              >
                <Text className="text-eyebrow font-semibold uppercase text-text-muted">
                  {shortDate(plan.date)}
                </Text>
                <Text className="mt-1.5 text-body font-semibold text-text-primary" numberOfLines={1}>
                  {plan.outfit.title}
                </Text>
                <View className="mt-md flex-row gap-1.5">
                  {plan.outfit.items.slice(0, 4).map((item) => (
                    <GarmentSwatch
                      key={item.id}
                      category={item.category}
                      colorHex={item.colorHex}
                      className="aspect-square flex-1 overflow-hidden rounded-sm"
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
          className="mt-3xl p-lg"
        >
          <View className="flex-row items-center gap-sm">
            <Sparkles size={16} color={color.primary500} />
            <Text className="text-eyebrow font-semibold uppercase text-primary-500">
              From your coach
            </Text>
          </View>
          <Text className="mt-sm text-h3 font-semibold text-text-primary">{featuredTip.title}</Text>
          <Text className="mt-1.5 text-body text-text-secondary" numberOfLines={2}>
            {featuredTip.body}
          </Text>
          <View className="mt-lg flex-row items-center gap-1">
            <Text className="text-caption font-semibold text-primary-700">See your style profile</Text>
            <ChevronRight size={14} color={color.primary500} />
          </View>
        </Card>
      ) : null}

      <SectionHeader title="Quick Actions" className="mt-3xl" />
      <View className="gap-md pb-3xl">
        <Card
          tone="inverse"
          onPress={() => router.push("/studio")}
          raise="md"
          className="flex-row items-center gap-lg p-lg"
        >
          <IconWell size="lg" tone="translucent" round>
            <Wand2 size={22} color={color.canvas} strokeWidth={1.75} />
          </IconWell>
          <View className="flex-1">
            <Text className="text-h3 font-semibold text-canvas">The Studio</Text>
            <Text className="mt-0.5 text-caption text-faint">
              Coaching, colour, gaps, planning & rating
            </Text>
          </View>
          <ChevronRight size={18} color={color.textMuted} />
        </Card>

        {/* Spec screen 13: two side-by-side cards, with Generate carried in
            the brand fill so the primary action is unmissable. */}
        <View className="flex-row gap-md">
          <QuickAction
            icon={<Shirt size={20} color={color.primary500} />}
            label="My Closet"
            onPress={() => router.push("/closet")}
          />
          <QuickAction
            icon={<Sparkles size={20} color={color.textOnPrimary} />}
            label="Generate"
            accent
            onPress={() => router.push("/generate")}
          />
        </View>
        <View className="flex-row gap-md">
          <QuickAction
            icon={<CalendarDays size={20} color={color.primary500} />}
            label="Plan the Week"
            onPress={() => router.push("/calendar")}
          />
          <QuickAction
            icon={<Wand2 size={20} color={color.primary500} />}
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
  accent = false,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  /** Fills the card with the brand colour — reserved for Generate. */
  accent?: boolean;
  onPress: () => void;
}) {
  // Built on `PressableScale` rather than `Card` so the accent fill isn't
  // competing with the card tone's own background rule.
  return (
    <PressableScale
      onPress={onPress}
      pressScale={motion.pressScale.md}
      pressOpacity={1}
      accessibilityRole="button"
      style={elevation.md}
      className={`flex-1 items-start gap-md rounded-xl border p-lg ${
        accent ? "border-primary-500 bg-primary-500" : "border-border bg-surface"
      }`}
    >
      <View
        className={`h-10 w-10 items-center justify-center rounded-md ${
          accent ? "bg-white/20" : "bg-primary-50"
        }`}
      >
        {icon}
      </View>
      <Text
        className={`text-body font-semibold ${accent ? "text-text-on-primary" : "text-text-primary"}`}
      >
        {label}
      </Text>
    </PressableScale>
  );
}
