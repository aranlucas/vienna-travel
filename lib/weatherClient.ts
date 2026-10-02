import { isWeatherSnapshot, type WeatherSnapshot } from './weatherSnapshot'

export const WEATHER_REQUEST_TIMEOUT_MS = 8_000

/** Bound the entire request, including body parsing, so a refresh cannot stay in flight forever. */
export async function fetchWeatherSnapshot(
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<WeatherSnapshot> {
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  if (signal?.aborted) controller.abort()
  const timeout = setTimeout(abort, WEATHER_REQUEST_TIMEOUT_MS)
  try {
    const response = await fetcher('/api/weather', { cache: 'no-store', signal: controller.signal })
    const payload: unknown = await response.json()
    if (!response.ok || !isWeatherSnapshot(payload)) throw new Error('Invalid weather response.')
    return payload
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }
}
