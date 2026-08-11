import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';
import { WeatherSnapshot } from './weather-snapshot.interface';
import {
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
}
