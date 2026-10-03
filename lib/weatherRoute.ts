import type { WeatherSnapshot } from './weatherSnapshot'

export function createWeatherHandler(load: () => Promise<WeatherSnapshot>) {
  return async function getWeather() {
    try {
      return Response.json(await load(), { headers: { 'Cache-Control': 'no-store, max-age=0' } })
    } catch {
      return Response.json(
        { error: 'The latest weather could not be loaded.' },
        { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      )
    }
  }
}
