'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { DayPlan } from '@/lib/tripData'
import { WEATHER_REFRESH_MS } from '@/lib/weatherRefresh'

const FOCUS_REFRESH_AGE_MS = WEATHER_REFRESH_MS

type WeatherApiResponse = {
  days: DayPlan[]
  refreshedAt: string
}

type LiveWeatherContextValue = {
  days: DayPlan[]
  error: string | null
  isLoading: boolean
  isRefreshing: boolean
  refreshedAt: string | null
  refresh: () => Promise<void>
}

const LiveWeatherContext = createContext<LiveWeatherContextValue | null>(null)

function isWeatherApiResponse(value: unknown): value is WeatherApiResponse {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<WeatherApiResponse>
  return Array.isArray(candidate.days) && typeof candidate.refreshedAt === 'string'
}

export function LiveWeatherPage({ children, staticDays }: { children: ReactNode; staticDays: DayPlan[] }) {
  const [weatherDays, setWeatherDays] = useState<DayPlan[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null)
  const inFlightRef = useRef<Promise<void> | null>(null)
  const lastSuccessfulRefreshRef = useRef(0)

  const refresh = useCallback(async () => {
    if (inFlightRef.current) return inFlightRef.current

    const request = (async () => {
      setIsRefreshing(true)
      try {
        const response = await fetch('/api/weather', { cache: 'no-store' })
        const payload: unknown = await response.json()
        if (!response.ok || !isWeatherApiResponse(payload)) {
          throw new Error('The weather endpoint returned an invalid response.')
        }

        setWeatherDays(payload.days)
        setRefreshedAt(payload.refreshedAt)
        setError(null)
        lastSuccessfulRefreshRef.current = Date.now()
      } catch {
        setError('Latest weather is temporarily unavailable. Keeping the last forecast or seasonal guidance.')
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    })()

    inFlightRef.current = request
    try {
      await request
    } finally {
      inFlightRef.current = null
    }
  }, [])

  useEffect(() => {
    void refresh()

    const interval = window.setInterval(() => void refresh(), WEATHER_REFRESH_MS)
    const refreshIfStale = () => {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastSuccessfulRefreshRef.current >= FOCUS_REFRESH_AGE_MS) void refresh()
    }
    const refreshWhenOnline = () => void refresh()

    document.addEventListener('visibilitychange', refreshIfStale)
    window.addEventListener('online', refreshWhenOnline)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', refreshIfStale)
      window.removeEventListener('online', refreshWhenOnline)
    }
  }, [refresh])

  const days = useMemo(() => {
    if (!weatherDays) return staticDays
    const weatherByDate = new Map(weatherDays.map((day) => [day.isoDate, day]))
    return staticDays.map((day) => ({ ...day, ...weatherByDate.get(day.isoDate) }))
  }, [staticDays, weatherDays])

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
