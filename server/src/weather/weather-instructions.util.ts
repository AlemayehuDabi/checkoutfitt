import { WeatherSnapshot } from './weather-snapshot.interface';

/** Translates raw weather data into styling guidance for the outfit-generation prompt. */
export function buildWeatherInstructions(weather: WeatherSnapshot): string {
  const parts = [
    `Current weather: ${Math.round(weather.tempCelsius)}°C, ${weather.description || weather.condition}.`,
  ];

  if (weather.rainMm > 0) {
    parts.push(
      'It is raining — prefer weather-resistant items and avoid delicate fabrics like suede.',
    );
  }
  if (weather.tempCelsius <= 10) {
    parts.push('It is cold — prioritize outerwear and warmer layers.');
  } else if (weather.tempCelsius >= 27) {
    parts.push(
      'It is hot — prioritize light, breathable items and avoid heavy outerwear.',
    );
  }
  if (weather.windSpeedMs >= 8) {
    parts.push('It is windy — a jacket or layered top is preferable.');
  }
  if (weather.uvIndex >= 6) {
    parts.push(
      'UV index is high — consider a hat or sun-protective item if one is available.',
    );
  }

  return parts.join(' ');
}
