import { createWeatherHandler } from "@/lib/weather-route";
import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import { DAYS } from "@/lib/data/itinerary";
import { WEATHER_REFRESH_SECONDS } from "@/lib/weather-refresh";
import { resolveDaysWeather } from "@/lib/weather-service";

export const dynamic = "force-dynamic";

const orderedDays = Object.values(DAYS).toSorted((a, b) => a.isoDate.localeCompare(b.isoDate));

const weatherDataFingerprint = createHash("sha256")
  .update(JSON.stringify(orderedDays))
  .digest("hex");

const getCachedWeather = unstable_cache(
  () => resolveDaysWeather(orderedDays),
  // The data cache persists across deployments. The fixed-length digest changes
  // whenever the itinerary changes without embedding the full dataset in the key.
  ["vienna-trip-weather-v3", weatherDataFingerprint],
  {
    revalidate: WEATHER_REFRESH_SECONDS,
    tags: ["trip-weather"],
  },
);

export const GET = createWeatherHandler(getCachedWeather);
