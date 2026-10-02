import { afterEach, expect, it, vi } from 'vitest'

// Synthetic itinerary and transparent cache adapter keep this route test offline.
vi.mock('next/cache', () => ({ unstable_cache: (fn: () => unknown) => fn }))
vi.mock('../lib/data/itinerary', () => ({
  DAYS: {
    '2026-10-02': {
      isoDate: '2026-10-02',
      date: 'Test day',
      title: 'Private static title',
      phaseId: 'test',
      activities: [],
      weatherLocation: { name: 'Synthetic point', coordinates: { lat: 1, lng: 2 } },
    },
  },
}))
import { GET } from '../app/api/weather/route'
import { isWeatherSnapshot } from '../lib/weatherSnapshot'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

it('returns the weather-only contract on success', async () => {
  vi.useFakeTimers({ now: new Date('2026-10-02T08:00:00Z') })
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      Response.json({
        daily: { time: ['2026-10-02'], temperature_2m_max: [22], temperature_2m_min: [12] },
      }),
    ),
  )
  const response = await GET()
  const payload = await response.json()
  expect(response.status).toBe(200)
  expect(response.headers.get('Cache-Control')).toBe('no-store, max-age=0')
  expect(isWeatherSnapshot(payload)).toBe(true)
  expect(payload.days[0].status).toBe('forecast')
  expect(JSON.stringify(payload)).not.toContain('Private static title')
  expect(payload).not.toHaveProperty('refreshedAt')
})

it('reports provider outages explicitly instead of stamping fallback guidance as a successful forecast', async () => {
  vi.useFakeTimers({ now: new Date('2026-10-02T08:00:00Z') })
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Synthetic outage')))
  const pending = GET()
  await vi.runAllTimersAsync()
  const payload = await (await pending).json()
  expect(isWeatherSnapshot(payload)).toBe(true)
  expect(payload.days[0].status).toBe('unavailable')
  expect(payload.days[0]).not.toHaveProperty('fetchedAt')
  expect(payload.days[0]).not.toHaveProperty('values')
})
