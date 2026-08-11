// Location is rounded to ~1.1km precision for the cache key, so nearby
// lookups within the same neighborhood share one cache entry.
export const WEATHER_LOCATION_PRECISION = 2;
export const WEATHER_CACHE_TTL_SECONDS = 30 * 60;
