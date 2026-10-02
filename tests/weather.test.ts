import { afterEach, describe, expect, it, vi } from 'vitest'
import type { DayPlan } from '../lib/tripData'
import { resolveDaysWeather } from '../lib/weatherService'
import {
  applyWeatherState,
  forecastLeadDays,
  isWeatherSnapshot,
  mergeWeatherSnapshot,
  weatherScope,
} from '../lib/weatherSnapshot'
import { fetchWeatherSnapshot, WEATHER_REQUEST_TIMEOUT_MS } from '../lib/weatherClient'

const now = new Date('2026-10-02T08:00:00Z')
const later = new Date('2026-10-02T08:31:00Z')
function day(isoDate = '2026-10-02', lat = 1): DayPlan {
  return {
    isoDate,
    date: isoDate,
    title: 'Synthetic visit',
    dayLabel: 'Test day',
    phaseId: 'test',
    activities: [{ title: 'Original activity', links: [{ label: 'Original', href: 'https://example.com/' }] }],
    accommodation: 'Original stay',
    weather: 'Seasonal guidance',
    weatherSource: 'historical',
    weatherLocation: { name: 'Synthetic location', coordinates: { lat, lng: 2 }, elevationM: 400 },
    weatherWindow: { label: 'Synthetic exposure', startHour: 9, endHour: 11 },
  }
}
function fixture(dates = ['2026-10-02'], high = 22) {
  return {
    daily: { time: dates, temperature_2m_max: dates.map(() => high), temperature_2m_min: dates.map(() => 12) },
    hourly: { time: ['2026-10-02T09:00', '2026-10-02T10:00', '2026-10-03T09:00'], temperature_2m: [15, 18, 99] },
  }
}
function mockFetch(data: unknown = fixture()) {
  return vi.fn<typeof fetch>().mockImplementation(async () => Response.json(data))
}
async function failSnapshot(days: DayPlan[]) {
  vi.useFakeTimers()
  const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error('Synthetic outage'))
  const pending = resolveDaysWeather(days, { now: later, fetcher })
  await vi.runAllTimersAsync()
  return { snapshot: await pending, fetcher }
}
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('weather resolver and last-good merge', () => {
  it('retains the last good forecast after both upstream attempts fail without advancing success time', async () => {
    const days = [day()]
    const success = await resolveDaysWeather(days, { now, fetcher: mockFetch() })
    const original = mergeWeatherSnapshot(days, null, success, now)
    const { snapshot, fetcher } = await failSnapshot(days)
    expect(fetcher).toHaveBeenCalledTimes(2)
    expect(snapshot.days[0].status).toBe('unavailable')
    expect(snapshot.days[0].fetchedAt).toBeUndefined()
    const failed = mergeWeatherSnapshot(days, original, snapshot, later)
    expect(failed.refreshedAt).toBe(now.toISOString())
    expect(failed.error).toContain('temporarily unavailable')
    expect(applyWeatherState(days, failed, later)[0]).toMatchObject({
      weatherHighC: 22,
      weatherSource: 'forecast',
      weatherStatus: 'stale',
      weatherFetchedAt: now.toISOString(),
    })
    expect(applyWeatherState(days, failed, later)[0].weatherUnlocks).toContain('stale')
  })

  it('updates successful locations while retaining only the failed location’s old forecast', async () => {
    const days = [day(), day('2026-10-03', 3)]
    const original = mergeWeatherSnapshot(
      days,
      null,
      await resolveDaysWeather(days, { now, fetcher: mockFetch(fixture(days.map((d) => d.isoDate))) }),
      now,
    )
    vi.useFakeTimers()
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (url) => {
      if (String(url).includes('latitude=3&')) throw new Error('Synthetic partial outage')
      return Response.json(fixture(['2026-10-02'], 28))
    })
    const pending = resolveDaysWeather(days, { now: later, fetcher })
    await vi.runAllTimersAsync()
    const state = mergeWeatherSnapshot(days, original, await pending, later)
    const results = applyWeatherState(days, state, later)
    expect(results[0]).toMatchObject({
      weatherHighC: 28,
      weatherStatus: 'forecast',
      weatherFetchedAt: later.toISOString(),
    })
    expect(results[1]).toMatchObject({ weatherHighC: 22, weatherStatus: 'stale', weatherFetchedAt: now.toISOString() })
    expect(state.refreshedAt).toBe(now.toISOString())
    expect(fetcher).toHaveBeenCalledTimes(3)
  })

  it('recovers after an outage and never replaces a newer forecast with an older cache entry', async () => {
    const days = [day()]
    const oldSnapshot = await resolveDaysWeather(days, { now, fetcher: mockFetch() })
    let state = mergeWeatherSnapshot(days, null, oldSnapshot, now)
    state = mergeWeatherSnapshot(days, state, null, later)
    const recovered = await resolveDaysWeather(days, { now: later, fetcher: mockFetch(fixture(undefined, 30)) })
    state = mergeWeatherSnapshot(days, state, recovered, later)
    expect(state.error).toBeNull()
    expect(state.refreshedAt).toBe(later.toISOString())
    state = mergeWeatherSnapshot(days, state, oldSnapshot, later)
    expect(applyWeatherState(days, state, later)[0].weatherHighC).toBe(30)
  })

  it.each([
    [
      'location',
      (d: DayPlan) => ({ ...d, weatherLocation: { ...d.weatherLocation!, coordinates: { lat: 3, lng: 2 } } }),
    ],
    ['elevation', (d: DayPlan) => ({ ...d, weatherLocation: { ...d.weatherLocation!, elevationM: 2000 } })],
    ['exposure window', (d: DayPlan) => ({ ...d, weatherWindow: { ...d.weatherWindow!, startHour: 12, endHour: 14 } })],
    ['date', (d: DayPlan) => ({ ...d, isoDate: '2026-10-03' })],
  ] as const)('does not carry a forecast into a different %s', async (_, change) => {
    const original = day()
    const snapshot = await resolveDaysWeather([original], { now, fetcher: mockFetch() })
    const previous = mergeWeatherSnapshot([original], null, snapshot, now)
    const changed = change(original)
    const state = mergeWeatherSnapshot([changed], previous, snapshot, now)
    expect(state.days[0].status).toBe('unavailable')
    expect(applyWeatherState([changed], state, now)[0].weatherHighC).toBeUndefined()
  })

  it('ignores unrelated endpoint fields and preserves static activities, links and accommodation', async () => {
    const days = [day()]
    const snapshot = await resolveDaysWeather(days, { now, fetcher: mockFetch() })
    Object.assign(snapshot.days[0].values!, {
      title: 'Wrong title',
      activities: [],
      accommodation: 'Wrong stay',
      weatherLocation: { name: 'Wrong place' },
    })
    const state = mergeWeatherSnapshot(days, null, snapshot, now)
    const result = applyWeatherState(days, state, now)[0]
    expect(result.title).toBe(days[0].title)
    expect(result.activities).toBe(days[0].activities)
    expect(result.accommodation).toBe(days[0].accommodation)
    expect(result.weatherLocation).toBe(days[0].weatherLocation)
    expect(state.days[0].values).not.toHaveProperty('activities')
    expect(snapshot.days[0]).not.toHaveProperty('accommodation')
  })

  it('deduplicates requests and limits hourly exposure to the matching day and window', async () => {
    const days = [day(), day('2026-10-03')]
    const fetcher = mockFetch(fixture(days.map((d) => d.isoDate)))
    const snapshot = await resolveDaysWeather(days, { now, fetcher })
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(snapshot.days[0].values?.weatherExposure).toMatchObject({ highC: 18, lowC: 15 })
    expect(snapshot.days[1].values?.weatherExposure).toMatchObject({ highC: 99, lowC: 99 })
  })

  it('marks cached forecasts stale using their original timestamp', async () => {
    const days = [day()]
    const snapshot = await resolveDaysWeather(days, { now, fetcher: mockFetch() })
    const state = mergeWeatherSnapshot(days, null, snapshot, later)
    expect(state.days[0].status).toBe('stale')
    expect(state.refreshedAt).toBeNull()
    expect(state.error).not.toBeNull()
  })

  it('uses Vienna midnight for eligibility and drops yesterday’s retained forecast', async () => {
    const before = new Date('2026-10-02T21:59:59Z')
    const midnight = new Date('2026-10-02T22:00:00Z')
    expect(forecastLeadDays('2026-10-18', before)).toBe(16)
    expect(forecastLeadDays('2026-10-18', midnight)).toBe(15)
    const days = [day()]
    const state = mergeWeatherSnapshot(
      days,
      null,
      await resolveDaysWeather(days, { now: before, fetcher: mockFetch() }),
      before,
    )
    const expired = mergeWeatherSnapshot(days, state, null, midnight)
    expect(expired.days[0].status).toBe('outside-window')
    expect(applyWeatherState(days, expired, midnight)[0].weatherHighC).toBeUndefined()
    const fetcher = mockFetch()
    const outside = await resolveDaysWeather([day('2026-10-18'), day('2026-10-01')], { now: before, fetcher })
    expect(fetcher).not.toHaveBeenCalled()
    expect(outside.days.every((d) => d.status === 'outside-window')).toBe(true)
  })

  it('does not carry yesterday’s outside-window result into a newly eligible day', async () => {
    const before = new Date('2026-10-02T21:59:59Z')
    const midnight = new Date('2026-10-02T22:00:00Z')
    const days = [day('2026-10-18')]
    const snapshot = await resolveDaysWeather(days, { now: before, fetcher: mockFetch() })
    const state = mergeWeatherSnapshot(days, null, snapshot, midnight)
    expect(state.days[0].status).toBe('unavailable')
    expect(state.error).not.toBeNull()
  })

  it('reports missing target dates and malformed daily temperatures as unavailable', async () => {
    vi.useFakeTimers()
    const fetcher = mockFetch({
      daily: { time: ['2026-10-02'], temperature_2m_max: ['NaN'], temperature_2m_min: [12] },
    })
    const pending = resolveDaysWeather([day()], { now, fetcher })
    await vi.runAllTimersAsync()
    expect((await pending).days[0].status).toBe('unavailable')
    expect(fetcher).toHaveBeenCalledTimes(2)
    const otherDay = await resolveDaysWeather([day()], { now, fetcher: mockFetch(fixture(['2026-10-03'])) })
    expect(otherDay.days[0].status).toBe('unavailable')
  })

  it('sanitizes non-finite optional daily and hourly values without generating NaN', async () => {
    const data = {
      daily: { ...fixture().daily, precipitation_sum: ['bad'], wind_speed_10m_max: [Infinity], sunrise: [3] },
      hourly: { time: ['2026-10-02T09:00', '2026-10-02T10:00'], temperature_2m: [NaN, 15], precipitation: [1, 'bad'] },
    }
    // Keep non-finite values intact to exercise the parser rather than JSON's NaN->null conversion.
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue({ ok: true, json: async () => data } as Response)
    const snapshot = await resolveDaysWeather([day()], { now, fetcher })
    expect(snapshot.days[0].status).toBe('forecast')
    expect(snapshot.days[0].values).toMatchObject({ weatherHighC: 22, weatherExposure: { highC: 15, lowC: 15 } })
    expect(snapshot.days[0].values?.weatherPrecipMm).toBeUndefined()
    expect(snapshot.days[0].values?.weatherWindKph).toBeUndefined()
    expect(snapshot.days[0].values?.weatherSunrise).toBeUndefined()
    expect(isWeatherSnapshot(snapshot)).toBe(true)
  })
})

describe('browser weather transport', () => {
  it('rejects malformed, duplicate and old-format payloads', async () => {
    expect(isWeatherSnapshot({ days: [], refreshedAt: now.toISOString() })).toBe(false)
    const snapshot = await resolveDaysWeather([day()], { now, fetcher: mockFetch() })
    expect(isWeatherSnapshot({ ...snapshot, days: [...snapshot.days, snapshot.days[0]] })).toBe(false)
    expect(isWeatherSnapshot({ ...snapshot, checkedAt: 'not a date' })).toBe(false)
    snapshot.days[0].values!.weatherHighC = NaN
    expect(isWeatherSnapshot(snapshot)).toBe(false)
    await expect(fetchWeatherSnapshot(undefined, mockFetch(snapshot))).rejects.toThrow('Invalid weather response')
  })

  it('times out stalled requests, then permits a successful retry', async () => {
    vi.useFakeTimers()
    const stalled = vi.fn<typeof fetch>().mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('Aborted')), { once: true })
        }),
    )
    const rejected = expect(fetchWeatherSnapshot(undefined, stalled)).rejects.toThrow('Aborted')
    await vi.advanceTimersByTimeAsync(WEATHER_REQUEST_TIMEOUT_MS)
    await rejected
    const snapshot = await resolveDaysWeather([day()], { now, fetcher: mockFetch() })
    await expect(fetchWeatherSnapshot(undefined, mockFetch(snapshot))).resolves.toEqual(
      JSON.parse(JSON.stringify(snapshot)),
    )
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cancels requests on provider cleanup', async () => {
    const controller = new AbortController()
    const fetcher = vi.fn<typeof fetch>().mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('Aborted')), { once: true })
        }),
    )
    const rejected = expect(fetchWeatherSnapshot(controller.signal, fetcher)).rejects.toThrow('Aborted')
    controller.abort()
    await rejected
  })

  it('preserves good weather on HTTP failures using the same state merge as the provider', async () => {
    const days = [day()]
    const payload = await resolveDaysWeather(days, { now, fetcher: mockFetch() })
    const loaded = await fetchWeatherSnapshot(undefined, mockFetch(payload))
    const previous = mergeWeatherSnapshot(days, null, loaded, now)
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('Service unavailable', { status: 503 }))
    let incoming = null
    try {
      incoming = await fetchWeatherSnapshot(undefined, fetcher)
    } catch {
      /* Provider failure path. */
    }
    const state = mergeWeatherSnapshot(days, previous, incoming, later)
    expect(state.days[0].scope).toBe(weatherScope(days[0]))
    expect(state.days[0].status).toBe('stale')
    expect(state.refreshedAt).toBe(now.toISOString())
  })
})
