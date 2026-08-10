import type { WeatherData } from "@/types";

export const DEFAULT_LOCATION = "San Francisco, CA";

export const MOCK_WEATHER: Omit<WeatherData, "location"> = {
  tempF: 66,
  condition: "Partly Cloudy",
  rainChance: 20,
  windMph: 9,
  uvIndex: 5,
};

export const TODAY_OUTFIT_REASON =
  "It'll be breezy and partly cloudy with a small chance of afternoon showers — a light layer you can shed keeps you comfortable from your morning commute through the evening.";
