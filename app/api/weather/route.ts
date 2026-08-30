import { unstable_cache } from 'next/cache'
import { DAYS } from '@/lib/data/itinerary'
import { WEATHER_REFRESH_SECONDS } from '@/lib/weatherRefresh'
import { resolveDaysWeather } from '@/lib/weatherService'

export const dynamic = 'force-dynamic'

const orderedDays = Object.values(DAYS).sort((a, b) => a.isoDate.localeCompare(b.isoDate))

const getCachedWeather = unstable_cache(
  async () => {
    const days = await resolveDaysWeather(orderedDays)

    return {
      days,
      refreshedAt: new Date().toISOString(),
    }
  },
  // The data cache persists across deployments. Include every weather input in
  // the key so itinerary edits cannot reuse a response from an older deploy.
  ['vienna-trip-weather', JSON.stringify(orderedDays)],
  {
    revalidate: WEATHER_REFRESH_SECONDS,
    tags: ['trip-weather'],
  },
)

export async function GET() {
  try {
    const weather = await getCachedWeather()

    return Response.json(weather, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch {
    return Response.json(
      { error: 'The latest weather could not be loaded.' },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    )
  }
}
