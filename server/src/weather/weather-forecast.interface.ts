/** One day of the OpenWeather daily forecast, normalized like WeatherSnapshot. */
export interface DailyForecast {
  /** YYYY-MM-DD, UTC. */
  date: string;
  tempMinCelsius: number;
  tempMaxCelsius: number;
  condition: string;
  description: string;
  rainMm: number;
  windSpeedMs: number;
}

export interface GeocodedPlace {
  name: string;
  country: string | null;
  latitude: number;
  longitude: number;
}
