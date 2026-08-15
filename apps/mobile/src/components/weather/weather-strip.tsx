import { router } from "expo-router";
import { CloudSun, Droplets, MapPin, Sun, Wind } from "lucide-react-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { color, motion } from "@/design";
import type { WeatherData } from "@/types";

/**
 * Spec §6.2 flat card. The strip sits *on* the canvas rather than above it —
 * secondary surface, 16px radius, no border and no shadow — with the weather
 * glyph leading and temperature, location and conditions reading off to its
 * right. It's context, not a card competing with today's outfit.
 */
export function WeatherStrip({ weather }: { weather: WeatherData }) {
  return (
    <PressableScale
      onPress={() => router.push("/location")}
      pressScale={motion.pressScale.md}
      pressOpacity={1}
      accessibilityRole="button"
      accessibilityLabel="Change location"
      className="rounded-lg bg-surface-secondary p-lg"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-md">
          <CloudSun size={32} color={color.primary500} strokeWidth={1.75} />
          <View className="flex-1">
            <View className="flex-row items-baseline gap-sm">
              <Text className="text-h1 font-bold text-text-primary">{weather.tempF}°</Text>
              <Text className="text-body text-text-secondary">{weather.condition}</Text>
            </View>
            <View className="mt-0.5 flex-row items-center gap-1">
              <MapPin size={12} color={color.textMuted} />
              <Text className="text-caption text-text-muted" numberOfLines={1}>
                {weather.location}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-lg">
          <Metric icon={<Droplets size={15} color={color.textMuted} />} label={`${weather.rainChance}%`} />
          <Metric icon={<Wind size={15} color={color.textMuted} />} label={`${weather.windMph} mph`} />
          <Metric icon={<Sun size={15} color={color.textMuted} />} label={`UV ${weather.uvIndex}`} />
        </View>
      </View>
    </PressableScale>
  );
}

function Metric({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View className="items-center gap-1.5">
      {icon}
      <Text className="text-tag font-medium text-text-secondary">{label}</Text>
    </View>
  );
}
