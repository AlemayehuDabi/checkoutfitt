export interface WeatherSnapshot {
  tempCelsius: number;
  condition: string;
  description: string;
  rainMm: number;
  windSpeedMs: number;
  uvIndex: number;
  fetchedAt: string;
}
