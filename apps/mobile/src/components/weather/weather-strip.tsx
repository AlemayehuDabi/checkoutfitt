import { router } from "expo-router";
import { CloudSun, Droplets, MapPin, Sun, Wind } from "lucide-react-native";
import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import type { WeatherData } from "@/types";

import { color } from "@/design";

export function WeatherStrip({ weather }: { weather: WeatherData }) {
  return (
    <Pressable
      onPress={() => router.push("/location")}
      className="rounded-3xl border border-line bg-surface p-5 active:opacity-90"
    >
      <View className="flex-row items-center gap-1.5">
        <MapPin size={14} color={color.muted} />
        <Text className="text-sm font-medium text-muted" numberOfLines={1}>
          {weather.location}
        </Text>
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <CloudSun size={28} color={color.primary} strokeWidth={1.5} />
          </View>
          <View>
            <Text className="text-3xl font-bold text-ink">{weather.tempF}°</Text>
            <Text className="text-sm text-muted">{weather.condition}</Text>
          </View>
        </View>

        <View className="flex-row gap-4">
          <Metric icon={<Droplets size={16} color={color.muted} />} label={`${weather.rainChance}%`} />
          <Metric icon={<Wind size={16} color={color.muted} />} label={`${weather.windMph} mph`} />
          <Metric icon={<Sun size={16} color={color.muted} />} label={`UV ${weather.uvIndex}`} />
        </View>
      </View>
    </Pressable>
  );
}

function Metric({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View className="items-center gap-1.5">
      {icon}
      <Text className="text-xs font-medium text-ink-soft">{label}</Text>
    </View>
  );
}
