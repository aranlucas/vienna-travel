import type { DayPlan, DayWeatherLocation } from './tripData'

const FORECAST_API = 'https://api.open-meteo.com/v1/forecast'
const FORECAST_WINDOW_DAYS = 16
const TRIP_TIME_ZONE = 'Europe/Vienna'
const FORECAST_FETCH_ATTEMPTS = 2
const FORECAST_RETRY_DELAY_MS = 250
// Keep both attempts and their retry delay comfortably below six seconds per location.
const FORECAST_FETCH_TIMEOUT_MS = 2_500

type OpenMeteoDaily = {
  time: string[]
  temperature_2m_max?: (number | null)[]
  temperature_2m_min?: (number | null)[]
  apparent_temperature_max?: (number | null)[]
  apparent_temperature_min?: (number | null)[]
  precipitation_probability_max?: (number | null)[]
  precipitation_sum?: (number | null)[]
  precipitation_hours?: (number | null)[]
  weather_code?: (number | null)[]
  wind_speed_10m_max?: (number | null)[]
  wind_gusts_10m_max?: (number | null)[]
  wind_direction_10m_dominant?: (number | null)[]
  uv_index_max?: (number | null)[]
  sunrise?: (string | null)[]
  sunset?: (string | null)[]
}

type OpenMeteoHourly = {
  time: string[]
  temperature_2m?: (number | null)[]
  apparent_temperature?: (number | null)[]
  precipitation_probability?: (number | null)[]
  precipitation?: (number | null)[]
  wind_speed_10m?: (number | null)[]
  wind_gusts_10m?: (number | null)[]
}

type OpenMeteoResponse = {
  daily?: OpenMeteoDaily
  hourly?: OpenMeteoHourly
}

export type ForecastEntry = {
  maxC: number
  minC: number
  feelsMaxC: number | null
  feelsMinC: number | null
  precipPct: number | null
  precipMm: number | null
  precipHours: number | null
  code: number | null
  windKph: number | null
  gustKph: number | null
  windDirectionDeg: number | null
  uvMax: number | null
  sunrise: string | null
  sunset: string | null
}

type HourlyForecastEntry = {
  temperatureC: number
  feelsC: number | null
  precipPct: number | null
  precipMm: number | null
  windKph: number | null
  gustKph: number | null
}

type LocationForecast = {
  byDate: Map<string, ForecastEntry>
  byHour: Map<string, HourlyForecastEntry>
}

function locationKey(location: DayWeatherLocation): string {
  const elevation = location.elevationM == null ? 'auto' : Math.round(location.elevationM)
  return `${location.coordinates.lat.toFixed(4)},${location.coordinates.lng.toFixed(4)}@${elevation}`
}

function daysUntil(targetIsoDate: string): number {
  const todayParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TRIP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const part = (type: 'year' | 'month' | 'day') => Number(todayParts.find((item) => item.type === type)?.value)
  const todayUtc = Date.UTC(part('year'), part('month') - 1, part('day'))
  const [targetYear, targetMonth, targetDay] = targetIsoDate.split('-').map(Number)
  const targetUtc = Date.UTC(targetYear, targetMonth - 1, targetDay)
  return Math.round((targetUtc - todayUtc) / 86400000)
}

function describeWeatherCode(code?: number | null): string | undefined {
  if (code == null) return undefined
  if (code === 0) return 'Clear conditions are most likely.'
  if ([1, 2].includes(code)) return 'Mostly clear to partly cloudy conditions are likely.'
  if (code === 3) return 'Cloud cover is likely for much of the day.'
  if ([45, 48].includes(code)) return 'Low cloud or fog is possible.'
  if ([51, 53, 55, 56, 57].includes(code)) return 'Light rain or drizzle is possible.'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain is possible, so keep the shell handy.'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Cold conditions or even snow are possible at elevation.'
  if ([95, 96, 99].includes(code)) return 'Storm risk is present; watch the alpine forecast closely.'
  return undefined
}

function formatUnlockDate(targetIsoDate: string): string {
  const d = new Date(`${targetIsoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - (FORECAST_WINDOW_DAYS - 1))
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`
}

/**
 * One Open-Meteo call per location covering its next 16 days (no start/end dates,
 * so far-future trip days can never trigger an API error).
 */
async function fetchLocationForecast(location: DayWeatherLocation): Promise<LocationForecast> {
  const byDate = new Map<string, ForecastEntry>()
  const byHour = new Map<string, HourlyForecastEntry>()
  const { lat, lng } = location.coordinates
  const elevation = location.elevationM == null ? '' : `&elevation=${Math.round(location.elevationM)}`
  const url =
    `${FORECAST_API}?latitude=${lat}&longitude=${lng}` +
    `&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,` +
    `precipitation_probability_max,precipitation_sum,precipitation_hours,weather_code,` +
    `wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,uv_index_max,sunrise,sunset` +
    `&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,` +
    `wind_speed_10m,wind_gusts_10m` +
    `&timezone=${encodeURIComponent(TRIP_TIME_ZONE)}&forecast_days=${FORECAST_WINDOW_DAYS}${elevation}`

  for (let attempt = 0; attempt < FORECAST_FETCH_ATTEMPTS; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FORECAST_FETCH_TIMEOUT_MS)
    try {
      const headers = attempt === 0 ? undefined : { 'x-vienna-weather-attempt': String(attempt + 1) }
      const res = await fetch(url, {
        cache: 'no-store',
        headers,
        signal: controller.signal,
      })

      if (res.ok) {
        const data = (await res.json()) as OpenMeteoResponse
        const daily = data.daily
        const hourly = data.hourly

        daily?.time?.forEach((isoDate, i) => {
          const maxC = daily.temperature_2m_max?.[i]
          const minC = daily.temperature_2m_min?.[i]
          if (maxC == null || minC == null) return
          byDate.set(isoDate, {
            maxC,
            minC,
            feelsMaxC: daily.apparent_temperature_max?.[i] ?? null,
            feelsMinC: daily.apparent_temperature_min?.[i] ?? null,
            precipPct: daily.precipitation_probability_max?.[i] ?? null,
            precipMm: daily.precipitation_sum?.[i] ?? null,
            precipHours: daily.precipitation_hours?.[i] ?? null,
            code: daily.weather_code?.[i] ?? null,
            windKph: daily.wind_speed_10m_max?.[i] ?? null,
            gustKph: daily.wind_gusts_10m_max?.[i] ?? null,
            windDirectionDeg: daily.wind_direction_10m_dominant?.[i] ?? null,
            uvMax: daily.uv_index_max?.[i] ?? null,
            sunrise: daily.sunrise?.[i] ?? null,
            sunset: daily.sunset?.[i] ?? null,
          })
        })

        hourly?.time?.forEach((localDateTime, i) => {
          const temperatureC = hourly.temperature_2m?.[i]
          if (temperatureC == null) return
          byHour.set(localDateTime, {
            temperatureC,
            feelsC: hourly.apparent_temperature?.[i] ?? null,
            precipPct: hourly.precipitation_probability?.[i] ?? null,
            precipMm: hourly.precipitation?.[i] ?? null,
            windKph: hourly.wind_speed_10m?.[i] ?? null,
            gustKph: hourly.wind_gusts_10m?.[i] ?? null,
          })
        })

        if (byDate.size > 0) return { byDate, byHour }
      }
    } catch {
      // Retry once before callers fall back to the historical notes.
    } finally {
      clearTimeout(timeout)
    }

    if (attempt + 1 < FORECAST_FETCH_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, FORECAST_RETRY_DELAY_MS))
    }
  }

  return { byDate, byHour }
}

function maxValue(values: (number | null)[]): number | undefined {
  const present = values.filter((value): value is number => value != null)
  return present.length ? Math.max(...present) : undefined
}

function minValue(values: (number | null)[]): number | undefined {
  const present = values.filter((value): value is number => value != null)
  return present.length ? Math.min(...present) : undefined
}

function sumValue(values: (number | null)[]): number | undefined {
  const present = values.filter((value): value is number => value != null)
  if (!present.length) return undefined
  return Math.round(present.reduce((sum, value) => sum + value, 0) * 100) / 100
}

function resolveExposure(day: DayPlan, forecast: LocationForecast): DayPlan['weatherExposure'] {
  const window = day.weatherWindow
  if (!window) return undefined

  const entries = [...forecast.byHour.entries()]
    .filter(([localDateTime]) => {
      if (!localDateTime.startsWith(`${day.isoDate}T`)) return false
      const hour = Number(localDateTime.slice(11, 13))
      return hour >= window.startHour && hour <= window.endHour
    })
    .map(([, entry]) => entry)
  if (!entries.length) return undefined

  const highC = maxValue(entries.map((entry) => entry.temperatureC))
  const lowC = minValue(entries.map((entry) => entry.temperatureC))
  if (highC == null || lowC == null) return undefined

  const feelsHighC = maxValue(entries.map((entry) => entry.feelsC))
  const feelsLowC = minValue(entries.map((entry) => entry.feelsC))
  const precipPct = maxValue(entries.map((entry) => entry.precipPct))
  const precipMm = sumValue(entries.map((entry) => entry.precipMm))
  const windKph = maxValue(entries.map((entry) => entry.windKph))
  const gustKph = maxValue(entries.map((entry) => entry.gustKph))

  return {
    ...window,
    highC: Math.round(highC),
    lowC: Math.round(lowC),
    feelsHighC: feelsHighC == null ? undefined : Math.round(feelsHighC),
    feelsLowC: feelsLowC == null ? undefined : Math.round(feelsLowC),
    precipPct: precipPct == null ? undefined : Math.round(precipPct),
    precipMm,
    windKph: windKph == null ? undefined : Math.round(windKph),
    gustKph: gustKph == null ? undefined : Math.round(gustKph),
  }
}

/**
 * Enriches every day that has a weatherLocation:
 * - inside the 16-day window → live forecast (temps, precip %, condition note)
 * - outside it → keeps the historical note and adds when the live forecast opens
 *
 * The dynamic weather route calls this resolver after the static page has loaded.
 * The individual fetches bypass the Next.js fetch cache so each server-side cache
 * refresh is a coherent new forecast; the route caps those batches to one per
 * 30-minute shared cache window.
 */
export async function resolveDaysWeather(days: DayPlan[]): Promise<DayPlan[]> {
  const deltas = new Map(days.map((day) => [day.isoDate, daysUntil(day.isoDate)]))
  const locations = new Map<string, DayWeatherLocation>()
  for (const day of days) {
    const delta = deltas.get(day.isoDate)
    if (day.weatherLocation && delta != null && delta >= 0 && delta < FORECAST_WINDOW_DAYS) {
      locations.set(locationKey(day.weatherLocation), day.weatherLocation)
    }
  }

  const entries = await Promise.all(
    [...locations.entries()].map(async ([key, location]) => [key, await fetchLocationForecast(location)] as const),
  )
  const forecasts = new Map(entries)

  return days.map((day) => {
    if (!day.weatherLocation) return day

    const delta = deltas.get(day.isoDate) ?? daysUntil(day.isoDate)
    if (delta < 0) return day

    const forecast = forecasts.get(locationKey(day.weatherLocation))
    const entry = forecast?.byDate.get(day.isoDate)

    if (forecast && entry && delta < FORECAST_WINDOW_DAYS) {
      const precipParts = [
        entry.precipPct == null ? null : `${Math.round(entry.precipPct)}% max precip chance`,
        entry.precipMm == null || entry.precipMm <= 0 ? null : `${entry.precipMm.toFixed(1)} mm modeled`,
      ].filter(Boolean)
      const precipText = precipParts.length ? `, ${precipParts.join(', ')}` : ''
      const name = day.weatherLocation.name
      const conditionNote = describeWeatherCode(entry.code)
      const weatherExposure = resolveExposure(day, forecast)
      const exposureText = weatherExposure
        ? ` ${weatherExposure.label}: about ${weatherExposure.highC}°C / ${weatherExposure.lowC}°C.`
        : ''
      return {
        ...day,
        weatherHighC: Math.round(entry.maxC),
        weatherLowC: Math.round(entry.minC),
        weatherFeelsHighC: entry.feelsMaxC == null ? undefined : Math.round(entry.feelsMaxC),
        weatherFeelsLowC: entry.feelsMinC == null ? undefined : Math.round(entry.feelsMinC),
        weatherPrecipPct: entry.precipPct == null ? undefined : Math.round(entry.precipPct),
        weatherPrecipMm: entry.precipMm == null ? undefined : entry.precipMm,
        weatherPrecipHours: entry.precipHours == null ? undefined : entry.precipHours,
        weatherCode: entry.code ?? undefined,
        weatherWindKph: entry.windKph == null ? undefined : Math.round(entry.windKph),
        weatherGustKph: entry.gustKph == null ? undefined : Math.round(entry.gustKph),
        weatherWindDirectionDeg: entry.windDirectionDeg == null ? undefined : Math.round(entry.windDirectionDeg),
        weatherUvMax: entry.uvMax == null ? undefined : entry.uvMax,
        weatherSunrise: entry.sunrise ?? undefined,
        weatherSunset: entry.sunset ?? undefined,
        weatherForecastLeadDays: delta,
        weatherExposure,
        weather: `${name} full-day forecast: about ${Math.round(entry.maxC)}°C / ${Math.round(entry.minC)}°C${precipText}.${exposureText}`,
        weatherNote: [day.weatherNote, conditionNote].filter(Boolean).join(' '),
        weatherSource: 'forecast' as const,
        weatherUnlocks: undefined,
      }
    }

    const weatherUnlocks =
      delta < FORECAST_WINDOW_DAYS
        ? 'Live forecast temporarily unavailable; historical guidance is shown.'
        : `Live forecast opens ${formatUnlockDate(day.isoDate)}`
    return {
      ...day,
      weatherForecastLeadDays: undefined,
      weatherExposure: undefined,
      weatherUnlocks,
    }
  })
}
