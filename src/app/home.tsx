import { router } from "expo-router";
import { ChevronRight, MapPin, Shirt, Sparkles } from "lucide-react-native";
import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { GarmentSwatch } from "@/components/closet/garment-swatch";
import { Card } from "@/components/ui/card";
import { ScreenContainer } from "@/components/ui/screen-container";
import { WeatherStrip } from "@/components/weather/weather-strip";
import { useWeather } from "@/context/weather-context";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { locationName, weather, todayOutfit } = useWeather();

  return (
    <ScreenContainer scroll>
      <View className="pt-6">
        <Text className="text-sm text-muted">{getGreeting()}</Text>
        <Text className="text-2xl font-bold tracking-tight text-ink">Welcome back</Text>
      </View>

      <View className="mt-6">
        {locationName ? (
          <WeatherStrip weather={weather} />
        ) : (
          <Card onPress={() => router.push("/location")} className="flex-row items-center gap-4 p-5">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-clay-50">
              <MapPin size={20} color="#C1622D" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-ink">Set your location</Text>
              <Text className="mt-0.5 text-sm text-muted">
                Get outfit suggestions based on today&apos;s weather
              </Text>
            </View>
            <ChevronRight size={18} color="#8A8580" />
          </Card>
        )}
      </View>

      <Pressable
        onPress={() => router.push("/outfit-today")}
        className="mt-6 rounded-3xl border border-line bg-white p-5 active:opacity-90"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold uppercase tracking-wide text-clay">
            Today&apos;s Outfit
          </Text>
          <ChevronRight size={18} color="#8A8580" />
        </View>
        <Text className="mt-1 text-xl font-bold tracking-tight text-ink">{todayOutfit.title}</Text>
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

      <Text className="mb-3 mt-8 text-sm font-semibold text-ink">Quick Actions</Text>
      <View className="flex-row gap-3 pb-8">
        <QuickAction
          icon={<Shirt size={20} color="#1A1917" />}
          label="Browse Closet"
          onPress={() => router.push("/closet")}
        />
        <QuickAction
          icon={<Sparkles size={20} color="#1A1917" />}
          label="Generate a Look"
          onPress={() => router.push("/generate")}
        />
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
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-sand-100">{icon}</View>
      <Text className="text-sm font-semibold text-ink">{label}</Text>
    </Card>
  );
}
