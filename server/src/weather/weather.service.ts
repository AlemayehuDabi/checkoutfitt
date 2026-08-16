import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';
import { WeatherSnapshot } from './weather-snapshot.interface';
import { DailyForecast, GeocodedPlace } from './weather-forecast.interface';
import {
  FORECAST_CACHE_TTL_SECONDS,
  GEOCODE_CACHE_TTL_SECONDS,
  WEATHER_CACHE_TTL_SECONDS,
  WEATHER_LOCATION_PRECISION,
} from './constants';

interface OpenWeatherOneCallResponse {
  current: {
    temp: number;
    wind_speed: number;
    uvi: number;
    rain?: { '1h'?: number };
    weather?: { main: string; description: string }[];
  };
}

interface OpenWeatherDailyResponse {
  daily?: {
    dt: number;
    temp: { min: number; max: number };
    wind_speed: number;
    // Unlike `current.rain`, the daily entry reports rain as a plain number.
    rain?: number;
    weather?: { main: string; description: string }[];
  }[];
}

interface OpenWeatherGeocodeEntry {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly cache: CacheService,
  ) {}

  async getCurrentWeather(
    latitude: number,
    longitude: number,
  ): Promise<WeatherSnapshot> {
    const cacheKey = `weather:${latitude.toFixed(WEATHER_LOCATION_PRECISION)}:${longitude.toFixed(WEATHER_LOCATION_PRECISION)}`;
    const cached = await this.cache.get<WeatherSnapshot>(cacheKey);
    if (cached) {
      return cached;
    }

    const apiKey = this.config.get<string>('weather.apiKey');
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&exclude=minutely,hourly,daily,alerts`;

    let response: Response;
    try {
      response = await fetch(url);
    } catch (error) {
      this.logger.error(
        `Weather request failed: ${error instanceof Error ? error.message : error}`,
      );
      throw new ServiceUnavailableException('Weather provider is unavailable');
    }
    if (!response.ok) {
      this.logger.error(
        `Weather provider returned ${response.status} for (${latitude}, ${longitude})`,
      );
      throw new ServiceUnavailableException('Weather provider is unavailable');
    }

    const data = (await response.json()) as OpenWeatherOneCallResponse;
    const snapshot: WeatherSnapshot = {
      tempCelsius: data.current.temp,
      condition: data.current.weather?.[0]?.main ?? 'Unknown',
      description: data.current.weather?.[0]?.description ?? '',
      rainMm: data.current.rain?.['1h'] ?? 0,
      windSpeedMs: data.current.wind_speed,
      uvIndex: data.current.uvi,
      fetchedAt: new Date().toISOString(),
    };

    await this.cache.set(cacheKey, snapshot, WEATHER_CACHE_TTL_SECONDS);
    return snapshot;
  }

  /** Shared fetch + error handling for every OpenWeather endpoint. */
  private async fetchJson<T>(url: string, label: string): Promise<T> {
    let response: Response;
    try {
      response = await fetch(url);
    } catch (error) {
      this.logger.error(
        `${label} request failed: ${error instanceof Error ? error.message : error}`,
      );
      throw new ServiceUnavailableException('Weather provider is unavailable');
    }
    if (!response.ok) {
      this.logger.error(`${label} returned ${response.status}`);
      throw new ServiceUnavailableException('Weather provider is unavailable');
    }
    return (await response.json()) as T;
  }

  private get apiKey(): string | undefined {
    return this.config.get<string>('weather.apiKey');
  }

  /**
   * Daily forecast for a location. OpenWeather returns at most 8 days, so a
   * longer trip is only partially covered — callers surface that rather than
   * pretending the tail is forecast.
   */
  async getForecast(
    latitude: number,
    longitude: number,
  ): Promise<DailyForecast[]> {
    const cacheKey = `weather-forecast:${latitude.toFixed(WEATHER_LOCATION_PRECISION)}:${longitude.toFixed(WEATHER_LOCATION_PRECISION)}`;
    const cached = await this.cache.get<DailyForecast[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric&exclude=minutely,hourly,current,alerts`;
    const data = await this.fetchJson<OpenWeatherDailyResponse>(
      url,
      'Weather forecast',
    );

    const forecast: DailyForecast[] = (data.daily ?? []).map((day) => ({
      date: new Date(day.dt * 1000).toISOString().slice(0, 10),
      tempMinCelsius: day.temp.min,
      tempMaxCelsius: day.temp.max,
      condition: day.weather?.[0]?.main ?? 'Unknown',
      description: day.weather?.[0]?.description ?? '',
      rainMm: day.rain ?? 0,
      windSpeedMs: day.wind_speed,
    }));

    await this.cache.set(cacheKey, forecast, FORECAST_CACHE_TTL_SECONDS);
    return forecast;
  }

  /** Resolves a place name to coordinates via OpenWeather's geocoding API. */
  async geocode(query: string): Promise<GeocodedPlace> {
    const normalized = query.trim().toLowerCase();
    const cacheKey = `geocode:${normalized}`;
    const cached = await this.cache.get<GeocodedPlace>(cacheKey);
    if (cached) {
      return cached;
    }

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`;
    const results = await this.fetchJson<OpenWeatherGeocodeEntry[]>(
      url,
      'Geocoding',
    );

    const match = results?.[0];
    if (!match) {
      // A place we can't find is the caller's input problem, not an outage.
      throw new NotFoundException(
        `Could not find a place called "${query}". Try a city name, or pass coordinates as "lat,lng".`,
      );
    }

    const place: GeocodedPlace = {
      name: match.name,
      country: match.country ?? null,
      latitude: match.lat,
      longitude: match.lon,
    };
    await this.cache.set(cacheKey, place, GEOCODE_CACHE_TTL_SECONDS);
    return place;
  }
}
