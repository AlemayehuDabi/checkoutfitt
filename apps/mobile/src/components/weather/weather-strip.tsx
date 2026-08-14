import { router } from "expo-router";
import { CloudSun, Droplets, MapPin, Sun, Wind } from "lucide-react-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { ICON_SIZE, IconWell } from "@/components/ui/icon-well";
import { color } from "@/design";
import type { WeatherData } from "@/types";

export function WeatherStrip({ weather }: { weather: WeatherData }) {
  return (
    <Card hero raise="md" onPress={() => router.push("/location")} className="p-5">
      <View className="flex-row items-center gap-1.5">
        <MapPin size={13} color={color.faint} />
        <Text className="text-caption font-medium text-muted" numberOfLines={1}>
          {weather.location}
        </Text>
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3.5">
          <IconWell size="lg">
            <CloudSun size={ICON_SIZE.lg} color={color.primary} strokeWidth={1.75} />
          </IconWell>
          <View>
            {/* Temperature is the hero number on Home — it earns display size. */}
            <Text className="text-display font-bold text-ink">{weather.tempF}°</Text>
            <Text className="-mt-1 text-body-sm text-muted">{weather.condition}</Text>
          </View>
        </View>

        <View className="flex-row gap-4">
          <Metric icon={<Droplets size={15} color={color.faint} />} label={`${weather.rainChance}%`} />
          <Metric icon={<Wind size={15} color={color.faint} />} label={`${weather.windMph} mph`} />
          <Metric icon={<Sun size={15} color={color.faint} />} label={`UV ${weather.uvIndex}`} />
        </View>
      </View>
    </Card>
  );
}

function Metric({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View className="items-center gap-1.5">
      {icon}
      <Text className="text-micro font-semibold text-ink-soft">{label}</Text>
    </View>
  );
}
