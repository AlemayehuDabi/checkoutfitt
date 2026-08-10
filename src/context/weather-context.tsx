import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

import { generateOutfit } from "@/constants/mock-outfits";
import { MOCK_WEATHER, TODAY_OUTFIT_REASON } from "@/constants/mock-weather";
import type { Outfit, WeatherData } from "@/types";

type WeatherContextValue = {
  locationName: string | null;
  setLocationName: (name: string) => void;
  weather: WeatherData;
  todayOutfit: Outfit;
};

const WeatherContext = createContext<WeatherContextValue | null>(null);

function buildTodayOutfit(): Outfit {
  const outfit = generateOutfit("Casual");
  return { ...outfit, title: "Today's Outfit", reason: TODAY_OUTFIT_REASON };
}

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [todayOutfit] = useState<Outfit>(buildTodayOutfit);

  const value = useMemo<WeatherContextValue>(
    () => ({
      locationName,
      setLocationName,
      weather: { ...MOCK_WEATHER, location: locationName ?? "Set your location" },
      todayOutfit,
    }),
    [locationName, todayOutfit]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used within a WeatherProvider");
  return ctx;
}
