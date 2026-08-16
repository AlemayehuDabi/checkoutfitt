import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../ai/llm/llm.service';
import { ClosetService } from '../closet/closet.service';
import { WeatherService } from '../weather/weather.service';
import { DailyForecast } from '../weather/weather-forecast.interface';
import { ClosetItem } from '../../prisma/generated/prisma';
import {
  formatDateOnly,
  parseDateOnly,
  todayDateOnly,
} from '../calendar/date.util';
import { PackTripDto } from './dto/pack-trip.dto';
import {
  COORDINATE_PATTERN,
  MAX_ITEMS_IN_TRAVEL_PROMPT,
  MAX_TRIP_DAYS,
} from './constants';
import {
  buildTravelPrompt,
  TRAVEL_PLAN_JSON_SCHEMA,
  TRAVEL_SYSTEM_PROMPT,
  TravelClosetItem,
  TravelPlanPayload,
} from './travel.schema';

export interface PackingListEntry {
  closetItemId: string;
  type: string;
  name: string;
  imageUrl: string;
  essential: boolean;
}

export interface TravelPlanResult {
  destination: string;
  dates: { start: string; end: string };
  weather: {
    tempRange: { minCelsius: number; maxCelsius: number } | null;
    conditions: string[];
    /** True when the forecast doesn't reach the whole trip. */
    partial: boolean;
    daysForecast: number;
    totalDays: number;
  };
  packingList: PackingListEntry[];
  dailyOutfits: {
    date: string;
    occasion: string;
    items: {
      closetItemId: string;
      type: string;
      category: string;
      imageUrl: string;
    }[];
  }[];
  generatedAt: string;
}

function toTravelItem(item: ClosetItem): TravelClosetItem {
  return {
    id: item.id,
    type: (item.type ?? 'other').toLowerCase(),
    category: item.category ?? 'unknown',
    color: item.color ?? 'unknown',
    tags: item.tags,
  };
}

@Injectable()
export class TravelService {
  private readonly logger = new Logger(TravelService.name);

  constructor(
    private readonly llmService: LLMService,
    private readonly closetService: ClosetService,
    private readonly weatherService: WeatherService,
  ) {}

  /** Every calendar day of the trip, inclusive of both ends. */
  private resolveDates(dto: PackTripDto): Date[] {
    const start = parseDateOnly(dto.startDate);
    const end = parseDateOnly(dto.endDate);

    if (end < start) {
      throw new BadRequestException('endDate must not be before startDate');
    }
    if (start < todayDateOnly()) {
      throw new BadRequestException('startDate must not be in the past');
    }

    const days = Math.round(
      (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000) + 1,
    );
    if (days > MAX_TRIP_DAYS) {
      throw new BadRequestException(
        `Trips are limited to ${MAX_TRIP_DAYS} days; this one is ${days}.`,
      );
    }

    return Array.from({ length: days }, (_, offset) => {
      const date = new Date(start);
      date.setUTCDate(date.getUTCDate() + offset);
      return date;
    });
  }

  /** Accepts inline "lat,lng" as well as a place name, so a client with GPS
   * coordinates never needs a geocoding round trip. */
  private async resolveDestination(destination: string) {
    const coords = COORDINATE_PATTERN.exec(destination);
    if (coords) {
      const latitude = Number(coords[1]);
      const longitude = Number(coords[2]);
      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        Math.abs(latitude) > 90 ||
        Math.abs(longitude) > 180
      ) {
        throw new BadRequestException(
          'destination coordinates are out of range',
        );
      }
      return { name: destination.trim(), latitude, longitude };
    }

    const place = await this.weatherService.geocode(destination);
    return {
      name: place.country ? `${place.name}, ${place.country}` : place.name,
      latitude: place.latitude,
      longitude: place.longitude,
    };
  }

  async pack(userId: string, dto: PackTripDto): Promise<TravelPlanResult> {
    // Ordering matters: the cheap local and database checks run before any
    // external call, so an invalid trip or an empty closet fails fast with an
    // actionable message instead of a geocoding round trip whose failure
    // would surface as "weather provider unavailable".
    const dates = this.resolveDates(dto);
    const dateStrings = dates.map(formatDateOnly);

    const all = await this.closetService.list(userId, { archived: false });
    const items = all.filter((item) => item.status === 'DONE');
    if (items.length === 0) {
      throw new BadRequestException(
        'Add some closet items with completed detection before planning a trip.',
      );
    }

    const destination = await this.resolveDestination(dto.destination);

    // OpenWeather only forecasts ~8 days out, so a trip that starts later or
    // runs longer is partially uncovered. Days outside the window are
    // dropped rather than extrapolated.
    const forecast = await this.weatherService.getForecast(
      destination.latitude,
      destination.longitude,
    );
    const tripForecast = forecast.filter((day) =>
      dateStrings.includes(day.date),
    );
    const uncoveredDays = dateStrings.length - tripForecast.length;

    const sample = items.slice(0, MAX_ITEMS_IN_TRAVEL_PROMPT);
    const payload = await this.llmService.generateStructured<TravelPlanPayload>(
      {
        prompt: buildTravelPrompt({
          destination: destination.name,
          dates: dateStrings,
          forecast: tripForecast,
          uncoveredDays,
          occasions: dto.occasions ?? [],
          items: sample.map(toTravelItem),
          totalItems: items.length,
        }),
        schema: TRAVEL_PLAN_JSON_SCHEMA,
        schemaName: 'travel_packing_plan',
        systemPrompt: TRAVEL_SYSTEM_PROMPT,
        maxTokens: 4096,
      },
    );

    return {
      destination: destination.name,
      dates: {
        start: dateStrings[0],
        end: dateStrings[dateStrings.length - 1],
      },
      weather: this.summarizeWeather(tripForecast, dateStrings.length),
      ...this.normalize(payload, items, dateStrings),
      generatedAt: new Date().toISOString(),
    };
  }

  private summarizeWeather(
    forecast: DailyForecast[],
    totalDays: number,
  ): TravelPlanResult['weather'] {
    return {
      tempRange: forecast.length
        ? {
            minCelsius: Math.min(...forecast.map((d) => d.tempMinCelsius)),
            maxCelsius: Math.max(...forecast.map((d) => d.tempMaxCelsius)),
          }
        : null,
      conditions: [...new Set(forecast.map((day) => day.condition))],
      partial: forecast.length < totalDays,
      daysForecast: forecast.length,
      totalDays,
    };
  }

  private normalize(
    payload: TravelPlanPayload,
    items: ClosetItem[],
    dateStrings: string[],
  ): Pick<TravelPlanResult, 'packingList' | 'dailyOutfits'> {
    const byId = new Map(items.map((item) => [item.id, item]));

    // Same hallucination guard as outfit generation, plus de-duplication —
    // packing the same garment twice is meaningless.
    const packed = new Map<string, PackingListEntry>();
    for (const entry of Array.isArray(payload.packingList)
      ? payload.packingList
      : []) {
      const item = byId.get(entry?.closetItemId);
      if (!item || packed.has(item.id)) {
        continue;
      }
      packed.set(item.id, {
        closetItemId: item.id,
        type: (item.type ?? 'other').toLowerCase(),
        name: item.category ?? (item.type ?? 'item').toLowerCase(),
        imageUrl: item.imageUrl,
        essential: Boolean(entry.essential),
      });
    }

    if (packed.size === 0) {
      this.logger.warn('Travel plan returned no valid packing-list items');
    }

    const validDates = new Set(dateStrings);
    const dailyOutfits = (
      Array.isArray(payload.dailyOutfits) ? payload.dailyOutfits : []
    )
      // A day outside the trip isn't a day of the trip.
      .filter((outfit) => validDates.has(outfit?.date))
      .map((outfit) => ({
        date: outfit.date,
        occasion:
          typeof outfit.occasion === 'string' && outfit.occasion.trim()
            ? outfit.occasion.trim()
            : 'general',
        // You can only wear what you packed, so anything outside the packing
        // list is dropped rather than surfaced as a wearable suggestion.
        items: (Array.isArray(outfit.itemIds) ? outfit.itemIds : [])
          .filter((id) => packed.has(id))
          .map((id) => {
            const item = byId.get(id) as ClosetItem;
            return {
              closetItemId: item.id,
              type: (item.type ?? 'other').toLowerCase(),
              category: item.category ?? 'unknown',
              imageUrl: item.imageUrl,
            };
          }),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { packingList: [...packed.values()], dailyOutfits };
  }
}
