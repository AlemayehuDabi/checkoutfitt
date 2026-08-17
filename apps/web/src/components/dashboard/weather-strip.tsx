import * as React from "react";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Snowflake,
  Sun,
  Wind,
} from "lucide-react";
import type { MockWeather } from "@/lib/mock-data";

/** OpenWeather `condition` values map to lucide glyphs. */
const CONDITION_ICON: Record<string, React.ElementType> = {
  Clear: Sun,
  Clouds: CloudSun,
  Rain: CloudRain,
  Drizzle: CloudRain,
  Snow: Snowflake,
  Mist: Cloud,
};

export function WeatherStrip({ weather }: { weather: MockWeather }) {
  const Icon = CONDITION_ICON[weather.condition] ?? Cloud;

  return (
    <div className="flex flex-wrap items-center gap-xl rounded-lg border border-border bg-surface-secondary px-2xl py-xl">
      <Icon aria-hidden className="size-8 shrink-0 stroke-[1.5] text-primary-500" />

      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-sm">
          <span className="text-h2 text-text-primary tabular-nums">
            {Math.round(weather.tempCelsius)}°
          </span>
          <span className="text-body text-text-secondary capitalize">
            {weather.description}
          </span>
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-caption text-text-muted">
          <MapPin aria-hidden className="size-3.5" />
          {weather.city}
          <span aria-hidden>·</span>
          <span className="tabular-nums">
            H {Math.round(weather.highCelsius)}° L {Math.round(weather.lowCelsius)}°
          </span>
        </p>
      </div>

      <dl className="flex items-center gap-xl">
        <div className="text-right">
          <dt className="sr-only">Wind</dt>
          <dd className="flex items-center gap-1.5 text-sm text-text-secondary tabular-nums">
            <Wind aria-hidden className="size-4 text-text-muted" />
            {Math.round(weather.windSpeedMs)} m/s
          </dd>
        </div>
        <div className="text-right">
          <dt className="sr-only">UV index</dt>
          <dd className="flex items-center gap-1.5 text-sm text-text-secondary tabular-nums">
            <Droplets aria-hidden className="size-4 text-text-muted" />
            UV {weather.uvIndex}
          </dd>
        </div>
      </dl>
    </div>
  );
}
