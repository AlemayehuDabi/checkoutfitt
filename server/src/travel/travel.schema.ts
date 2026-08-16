import { DailyForecast } from '../weather/weather-forecast.interface';

export interface PackingItemPayload {
  closetItemId: string;
  essential: boolean;
}

export interface DailyOutfitPayload {
  date: string;
  occasion: string;
  itemIds: string[];
}

export interface TravelPlanPayload {
  packingList: PackingItemPayload[];
  dailyOutfits: DailyOutfitPayload[];
}

/** See gap-analysis.schema.ts for the `required`/`additionalProperties` rule. */
export const TRAVEL_PLAN_JSON_SCHEMA = {
  type: 'object',
  properties: {
    packingList: {
      type: 'array',
      description:
        'The items to pack, chosen only from the closet list provided. Keep it tight — favour versatile pieces that re-wear across days.',
      items: {
        type: 'object',
        properties: {
          closetItemId: {
            type: 'string',
            description:
              'Id of the item to pack, copied verbatim from the closet list.',
          },
          essential: {
            type: 'boolean',
            description:
              'True for items the trip genuinely cannot do without, false for nice-to-haves.',
          },
        },
        required: ['closetItemId', 'essential'],
        additionalProperties: false,
      },
    },
    dailyOutfits: {
      type: 'array',
      description:
        'One entry per day of the trip, in order. Every item worn must also appear in the packing list.',
      items: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'The day, as YYYY-MM-DD, taken from the trip dates.',
          },
          occasion: {
            type: 'string',
            description:
              'What this day\'s outfit is dressed for, e.g. "sightseeing" or "travel day".',
          },
          itemIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'Ids of the packed items worn that day.',
          },
        },
        required: ['date', 'occasion', 'itemIds'],
        additionalProperties: false,
      },
    },
  },
  required: ['packingList', 'dailyOutfits'],
  additionalProperties: false,
} as const;

export const TRAVEL_SYSTEM_PROMPT =
  "You are CheckoutFitt's travel packing assistant. You build a light, practical packing list from a person's own wardrobe and plan what they'll wear each day. Pack as little as possible: prefer versatile pieces that re-wear across several days and layer for changeable weather, and never pack something the forecast makes pointless.";

export interface TravelClosetItem {
  id: string;
  type: string;
  category: string;
  color: string;
  tags: string[];
}

function formatForecast(forecast: DailyForecast[]): string {
  if (forecast.length === 0) {
    return 'No forecast is available for these dates.';
  }
  return forecast
    .map(
      (day) =>
        `- ${day.date}: ${Math.round(day.tempMinCelsius)}-${Math.round(day.tempMaxCelsius)}°C, ${day.description || day.condition}${day.rainMm > 0 ? `, rain ${day.rainMm}mm` : ''}${day.windSpeedMs >= 8 ? ', windy' : ''}`,
    )
    .join('\n');
}

export function buildTravelPrompt(params: {
  destination: string;
  dates: string[];
  forecast: DailyForecast[];
  uncoveredDays: number;
  occasions: string[];
  items: TravelClosetItem[];
  totalItems: number;
}): string {
  const inventory = params.items
    .map(
      (item) =>
        `- id: ${item.id} | ${item.color} ${item.category} (${item.type})${item.tags.length ? ` [${item.tags.join(', ')}]` : ''}`,
    )
    .join('\n');

  const truncated =
    params.totalItems > params.items.length
      ? `\n(Showing ${params.items.length} of ${params.totalItems} items.)`
      : '';

  const sections = [
    `Plan what to pack for a ${params.dates.length}-day trip to ${params.destination}.`,
    `Trip dates: ${params.dates.join(', ')}.`,
    `Forecast:\n${formatForecast(params.forecast)}`,
  ];

  if (params.uncoveredDays > 0) {
    // Said plainly so the model plans conservatively rather than inventing
    // weather it was never given.
    sections.push(
      `The forecast only reaches part of the trip; ${params.uncoveredDays} day(s) have no forecast. Pack adaptable layers for those days rather than assuming specific weather.`,
    );
  }

  if (params.occasions.length) {
    sections.push(`Planned activities: ${params.occasions.join(', ')}.`);
  }

  sections.push(
    `Wardrobe to pack from:\n${inventory}${truncated}`,
    'Choose what to pack, marking the true essentials, then plan one outfit for each trip date using only the items you packed.',
  );

  return sections.join('\n\n');
}
