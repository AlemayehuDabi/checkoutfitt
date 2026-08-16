// Location is rounded to ~1.1km precision for the cache key, so nearby
// lookups within the same neighborhood share one cache entry.
export const WEATHER_LOCATION_PRECISION = 2;
export const WEATHER_CACHE_TTL_SECONDS = 30 * 60;

// Daily forecasts move far more slowly than current conditions, so they're
// held longer than the 30-minute "right now" snapshot.
export const FORECAST_CACHE_TTL_SECONDS = 3 * 60 * 60;

// A city's coordinates don't change; this cache exists purely to stop
// repeated trips to the same place re-billing the geocoding API.
export const GEOCODE_CACHE_TTL_SECONDS = 30 * 24 * 60 * 60;

/** OpenWeather One Call returns at most 8 days of daily forecast. */
export const MAX_FORECAST_DAYS = 8;
