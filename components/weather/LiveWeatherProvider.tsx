'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { DayPlan } from '@/lib/tripData'
import { WEATHER_REFRESH_MS } from '@/lib/weatherRefresh'
import { fetchWeatherSnapshot } from '@/lib/weatherClient'
import { applyWeatherState, mergeWeatherSnapshot, type WeatherState } from '@/lib/weatherSnapshot'

const FOCUS_REFRESH_AGE_MS = WEATHER_REFRESH_MS

type LiveWeatherContextValue = {
  days: DayPlan[]
  error: string | null
  isLoading: boolean
  isRefreshing: boolean
  refreshedAt: string | null
  refresh: () => Promise<void>
}

const LiveWeatherContext = createContext<LiveWeatherContextValue | null>(null)

export function LiveWeatherPage({ children, staticDays }: { children: ReactNode; staticDays: DayPlan[] }) {
  const [weatherState, setWeatherState] = useState<WeatherState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const inFlightRef = useRef<Promise<void> | null>(null)
  const requestController = useRef<AbortController | null>(null)
  const stateRef = useRef<WeatherState | null>(null)
  const staticDaysRef = useRef(staticDays)
  useEffect(() => {
    staticDaysRef.current = staticDays
  }, [staticDays])

  const refresh = useCallback(async () => {
    if (inFlightRef.current) return inFlightRef.current

    const controller = new AbortController()
    requestController.current = controller

    const request = (async () => {
      setIsRefreshing(true)

      try {
        const payload = await fetchWeatherSnapshot(controller.signal)

        if (controller.signal.aborted) return
        const next = mergeWeatherSnapshot(staticDaysRef.current, stateRef.current, payload)
        stateRef.current = next
        setWeatherState(next)
      } catch {
        if (controller.signal.aborted) return
        const next = mergeWeatherSnapshot(staticDaysRef.current, stateRef.current, null)
        stateRef.current = next
        setWeatherState(next)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
          setIsRefreshing(false)
        }
      }
    })()

    inFlightRef.current = request

    try {
      await request
    } finally {
      if (inFlightRef.current === request) inFlightRef.current = null
    }
  }, [])

  useEffect(() => {
    void refresh()

    const interval = window.setInterval(() => void refresh(), WEATHER_REFRESH_MS)

    const refreshIfStale = () => {
      if (document.visibilityState !== 'visible') return
      const lastSuccess = stateRef.current?.refreshedAt

      if (Date.now() - (lastSuccess ? Date.parse(lastSuccess) : 0) >= FOCUS_REFRESH_AGE_MS) void refresh()
    }

    const refreshWhenOnline = () => void refresh()

    document.addEventListener('visibilitychange', refreshIfStale)
    window.addEventListener('online', refreshWhenOnline)

    return () => {
      requestController.current?.abort()
      inFlightRef.current = null
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', refreshIfStale)
      window.removeEventListener('online', refreshWhenOnline)
    }
  }, [refresh])

  const days = useMemo(() => applyWeatherState(staticDays, weatherState), [staticDays, weatherState])
  const error = weatherState?.error ?? null
  const refreshedAt = weatherState?.refreshedAt ?? null

  const value = useMemo(
    () => ({ days, error, isLoading, isRefreshing, refreshedAt, refresh }),
    [days, error, isLoading, isRefreshing, refreshedAt, refresh],
  )

  return (
    <LiveWeatherContext.Provider value={value}>
      <main className="min-h-screen">{children}</main>
    </LiveWeatherContext.Provider>
  )
}

export function useLiveWeather(): LiveWeatherContextValue {
  const context = useContext(LiveWeatherContext)

  if (!context) throw new Error('useLiveWeather must be used inside LiveWeatherPage.')

  return context
}

export function useLiveWeatherDays(staticDays: DayPlan[]): DayPlan[] {
  const { days } = useLiveWeather()

  return useMemo(() => {
    const liveByDate = new Map(days.map((day) => [day.isoDate, day]))

    return staticDays.map((day) => liveByDate.get(day.isoDate) ?? day)
  }, [days, staticDays])
}
