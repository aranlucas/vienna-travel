import { z } from 'zod'
import type { DayPlan } from './tripData'
import { WEATHER_REFRESH_MS } from './weatherRefresh'

export const FORECAST_WINDOW_DAYS = 16

const TRIP_TIME_ZONE = 'Europe/Vienna'

export const WEATHER_UNAVAILABLE =
  'Latest weather is temporarily unavailable. Keeping the last forecast or seasonal guidance.'

const numericFields = [
  'weatherHighC',
  'weatherLowC',
  'weatherFeelsHighC',
  'weatherFeelsLowC',
  'weatherPrecipPct',
  'weatherPrecipMm',
  'weatherPrecipHours',
  'weatherCode',
  'weatherWindKph',
  'weatherGustKph',
  'weatherWindDirectionDeg',
  'weatherUvMax',
  'weatherForecastLeadDays',
] as const

const textFields = ['weather', 'weatherNote', 'weatherSunrise', 'weatherSunset'] as const

const weatherFields = [...numericFields, ...textFields, 'weatherExposure'] as const

export type WeatherValues = Pick<DayPlan, (typeof weatherFields)[number]>

export type WeatherDaySnapshot = {
  isoDate: string
  scope: string
  status: 'forecast' | 'stale' | 'unavailable' | 'outside-window'
  fetchedAt?: string | null
  values?: WeatherValues | null
}

export type WeatherSnapshot = { days: WeatherDaySnapshot[]; checkedAt: string }

export type WeatherState = { days: WeatherDaySnapshot[]; refreshedAt: string | null; error: string | null }

/** Identity includes the exact forecast point, elevation and exposure window, never just the date. */
export function weatherScope(day: DayPlan): string {
  const location = day.weatherLocation

  return JSON.stringify([
    location?.name,
    location?.coordinates.lat,
    location?.coordinates.lng,
    location?.elevationM ?? null,
    day.weatherWindow ?? null,
  ])
}

export function forecastLeadDays(isoDate: string, now: Date): number {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TRIP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)

  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value)
  const [year, month, day] = isoDate.split('-').map(Number)

  return Math.round(
    (Date.UTC(year, month - 1, day) - Date.UTC(part('year'), part('month') - 1, part('day'))) / 86400000,
  )
}

export function isForecastEligible(day: DayPlan, now: Date): boolean {
  const lead = forecastLeadDays(day.isoDate, now)

  return Boolean(day.weatherLocation) && lead >= 0 && lead < FORECAST_WINDOW_DAYS
}

/** Project only weather fields, even if an endpoint accidentally sends a whole itinerary day. */
export function weatherValues(day: WeatherValues): WeatherValues {
  return {
    weatherHighC: day.weatherHighC,
    weatherLowC: day.weatherLowC,
    weatherFeelsHighC: day.weatherFeelsHighC,
    weatherFeelsLowC: day.weatherFeelsLowC,
    weatherPrecipPct: day.weatherPrecipPct,
    weatherPrecipMm: day.weatherPrecipMm,
    weatherPrecipHours: day.weatherPrecipHours,
    weatherCode: day.weatherCode,
    weatherWindKph: day.weatherWindKph,
    weatherGustKph: day.weatherGustKph,
    weatherWindDirectionDeg: day.weatherWindDirectionDeg,
    weatherUvMax: day.weatherUvMax,
    weatherForecastLeadDays: day.weatherForecastLeadDays,
    weather: day.weather,
    weatherNote: day.weatherNote,
    weatherSunrise: day.weatherSunrise,
    weatherSunset: day.weatherSunset,
    weatherExposure: day.weatherExposure,
  }
}

const weatherContract = z
  .object({
    weatherHighC: z.number().optional(),
    weatherLowC: z.number().optional(),
    weatherFeelsHighC: z.number().optional(),
    weatherFeelsLowC: z.number().optional(),
    weatherPrecipPct: z.number().optional(),
    weatherPrecipMm: z.number().optional(),
    weatherPrecipHours: z.number().optional(),
    weatherCode: z.number().optional(),
    weatherWindKph: z.number().optional(),
    weatherGustKph: z.number().optional(),
    weatherWindDirectionDeg: z.number().optional(),
    weatherUvMax: z.number().optional(),
    weatherForecastLeadDays: z.number().optional(),
    weather: z.string().optional(),
    weatherNote: z.string().optional(),
    weatherSunrise: z.string().optional(),
    weatherSunset: z.string().optional(),
    weatherExposure: z
      .object({
        label: z.string(),
        startHour: z.number(),
        endHour: z.number(),
        highC: z.number(),
        lowC: z.number(),
        feelsHighC: z.number().optional(),
        feelsLowC: z.number().optional(),
        precipPct: z.number().optional(),
        precipMm: z.number().optional(),
        windKph: z.number().optional(),
        gustKph: z.number().optional(),
      })
      .optional(),
  })
  .required({ weather: true, weatherHighC: true, weatherLowC: true })

const timestamp = z.string().refine((value) => Number.isFinite(Date.parse(value)))

const identity = z.object({ isoDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), scope: z.string() })

const snapshotContract = z
  .object({
    checkedAt: timestamp,
    days: z.array(
      z.discriminatedUnion('status', [
        identity.extend({ status: z.literal('forecast'), fetchedAt: timestamp, values: weatherContract }),
        identity.extend({
          status: z.enum(['outside-window', 'unavailable']),
          fetchedAt: z.null().optional(),
          values: z.null().optional(),
        }),
      ]),
    ),
  })
  .refine((value) => new Set(value.days.map((day) => day.isoDate)).size === value.days.length)
  .refine((value) =>
    value.days.every((day) => day.status !== 'forecast' || Date.parse(day.fetchedAt) <= Date.parse(value.checkedAt)),
  )

export function isWeatherSnapshot(value: unknown): value is WeatherSnapshot {
  return snapshotContract.safeParse(value).success
}

/** A failed day retains only its own last-good forecast. A failed request is incoming=null. */
export function mergeWeatherSnapshot(
  staticDays: DayPlan[],
  previous: WeatherState | null,
  incoming: WeatherSnapshot | null,
  now = new Date(),
): WeatherState {
  const oldByDate = new Map(previous?.days.map((day) => [day.isoDate, day]))
  const newByDate = new Map(incoming?.days.map((day) => [day.isoDate, day]))

  const days = staticDays.flatMap<WeatherDaySnapshot>((day) => {
    if (!day.weatherLocation) return []
    const scope = weatherScope(day)
    const identity = { isoDate: day.isoDate, scope }

    if (!isForecastEligible(day, now)) return { ...identity, status: 'outside-window' }
    const next = newByDate.get(day.isoDate)
    const old = oldByDate.get(day.isoDate)
    const previousForecast = old?.scope === scope && old.values && old.fetchedAt ? old : undefined

    if (
      next?.scope === scope &&
      next.status === 'forecast' &&
      next.values &&
      next.fetchedAt &&
      Date.parse(next.fetchedAt) <= now.getTime()
    ) {
      const selected =
        previousForecast && Date.parse(previousForecast.fetchedAt!) > Date.parse(next.fetchedAt)
          ? previousForecast
          : { ...next, values: weatherValues(next.values) }

      const stale = selected.status === 'stale' || now.getTime() - Date.parse(selected.fetchedAt!) >= WEATHER_REFRESH_MS

      return { ...selected, status: stale ? 'stale' : 'forecast' }
    }

    if (previousForecast) return { ...previousForecast, status: 'stale' }

    return { ...identity, status: 'unavailable' }
  })

  const failed = days.some((day) => day.status === 'stale' || day.status === 'unavailable')
  const forecasts = days.filter((day) => day.status === 'forecast')

  // A cache hit carries its original fetch time; a partial/failed batch cannot advance this marker.
  const refreshedAt =
    !failed && forecasts.length ? forecasts.map((day) => day.fetchedAt!).sort()[0] : (previous?.refreshedAt ?? null)

  return { days, refreshedAt, error: failed ? WEATHER_UNAVAILABLE : null }
}

export function applyWeatherState(staticDays: DayPlan[], state: WeatherState | null, now = new Date()): DayPlan[] {
  const byDate = new Map(state?.days.map((day) => [day.isoDate, day]))

  return staticDays.map((day) => {
    const entry = byDate.get(day.isoDate)

    if (!entry || entry.scope !== weatherScope(day)) return day

    if (!isForecastEligible(day, now)) {
      const lead = forecastLeadDays(day.isoDate, now)
      const opens = new Date(`${day.isoDate}T00:00:00Z`)
      opens.setUTCDate(opens.getUTCDate() - FORECAST_WINDOW_DAYS + 1)

      return {
        ...day,
        weatherStatus: 'outside-window',
        weatherUnlocks:
          lead < 0
            ? undefined
            : `Live forecast opens ${opens.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`,
      }
    }

    if (entry.values && entry.fetchedAt) {
      const stale = entry.status === 'stale' || now.getTime() - Date.parse(entry.fetchedAt) >= WEATHER_REFRESH_MS

      return {
        ...day,
        ...weatherValues(entry.values),
        weatherSource: 'forecast',
        weatherStatus: stale ? 'stale' : 'forecast',
        weatherFetchedAt: entry.fetchedAt,
        weatherUnlocks: stale ? 'Last forecast is stale; the latest forecast is unavailable.' : undefined,
      }
    }

    return {
      ...day,
      weatherStatus: 'unavailable',
      weatherUnlocks: 'Live forecast temporarily unavailable; saved guidance is shown.',
    }
  })
}
