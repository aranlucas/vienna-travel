// @vitest-environment jsdom
import React, { act, useEffect } from 'react'
import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { LiveWeatherPage, useLiveWeather } from '../components/weather/LiveWeatherProvider'
import { weatherScope } from '../lib/weatherSnapshot'
import type { DayPlan } from '../lib/tripData'
import { WEATHER_REQUEST_TIMEOUT_MS } from '../lib/weatherClient'

const now = new Date('2026-10-02T08:00:00Z')

const day: DayPlan = {
  isoDate: '2026-10-02',
  date: 'Test day',
  dayLabel: 'Test day',
  title: 'Synthetic day',
  phaseId: 'test',
  activities: [],
  weather: 'Seasonal guidance',
  weatherSource: 'historical',
  weatherLocation: { name: 'Synthetic location', coordinates: { lat: 1, lng: 2 } },
}

const good = {
  checkedAt: now.toISOString(),
  days: [
    {
      isoDate: day.isoDate,
      scope: weatherScope(day),
      status: 'forecast',
      fetchedAt: now.toISOString(),
      values: { weather: 'Synthetic forecast', weatherHighC: 22, weatherLowC: 12 },
    },
  ],
}

const unavailable = {
  checkedAt: now.toISOString(),
  days: [{ isoDate: day.isoDate, scope: weatherScope(day), status: 'unavailable' }],
}

let current: ReturnType<typeof useLiveWeather>

let container: HTMLElement

function Consumer() {
  const value = useLiveWeather()
  useEffect(() => {
    current = value
  }, [value])

  return (
    <output>
      {value.days[0].weatherStatus}: {value.days[0].weatherHighC}
    </output>
  )
}

beforeEach(() => {
  vi.useFakeTimers({ now })
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
})

afterEach(async () => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

async function mount() {
  await act(async () => {
    container = render(
      <LiveWeatherPage staticDays={[day]}>
        <Consumer />
      </LiveWeatherPage>,
    ).container
  })
}

it('retains last-good values and exposes a stale state to actual provider consumers', async () => {
  const fetcher = vi.fn().mockResolvedValueOnce(Response.json(good)).mockResolvedValueOnce(Response.json(unavailable))
  vi.stubGlobal('fetch', fetcher)
  await mount()
  expect(container.textContent).toBe('forecast: 22')
  expect(current.refreshedAt).toBe(now.toISOString())
  await act(async () => {
    await current.refresh()
  })
  expect(container.textContent).toBe('stale: 22')
  expect(current.error).not.toBeNull()
  expect(current.refreshedAt).toBe(now.toISOString())
  expect(current.isRefreshing).toBe(false)
})

it('releases in-flight deduplication after a timeout so the next refresh can recover', async () => {
  const fetcher = vi
    .fn()
    .mockImplementationOnce(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () => reject(new Error('Synthetic timeout')), { once: true })
        }),
    )
    .mockResolvedValueOnce(Response.json(good))

  vi.stubGlobal('fetch', fetcher)
  await mount()
  expect(current.isRefreshing).toBe(true)
  // A concurrent refresh shares the pending request.
  let duplicate: Promise<void>
  await act(async () => {
    duplicate = current.refresh()
  })
  expect(fetcher).toHaveBeenCalledTimes(1)
  await act(async () => {
    await vi.advanceTimersByTimeAsync(WEATHER_REQUEST_TIMEOUT_MS)
    await duplicate
  })
  expect(current.isRefreshing).toBe(false)
  expect(current.isLoading).toBe(false)
  expect(current.error).not.toBeNull()
  await act(async () => {
    await current.refresh()
  })
  expect(fetcher).toHaveBeenCalledTimes(2)
  expect(container.textContent).toBe('forecast: 22')
  expect(current.error).toBeNull()
})
