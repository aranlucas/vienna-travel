'use client'

import { useMemo, useSyncExternalStore } from 'react'
import type { DayPlan } from '@/lib/tripData'
import { HOME_SECTION_IDS } from '@/lib/homeAnchors'
import { WEATHER_REFRESH_MINUTES } from '@/lib/weatherRefresh'
import { useLiveWeather } from '@/components/weather/LiveWeatherProvider'

type Unit = 'F' | 'C'
type HintTone = 'cold' | 'wet' | 'hot' | 'alert'

const UNIT_STORAGE_KEY = 'weather-unit'
const UNIT_EVENT = 'weather-unit-change'

function subscribeToUnit(onChange: () => void): () => void {
  window.addEventListener('storage', onChange)
  window.addEventListener(UNIT_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(UNIT_EVENT, onChange)
  }
}

function getUnitSnapshot(): Unit {
  return window.localStorage.getItem(UNIT_STORAGE_KEY) === 'C' ? 'C' : 'F'
}

function getServerUnit(): Unit {
  return 'F'
}

const CONDITION_EMOJI: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌦️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '❄️',
  77: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '🌧️',
  85: '🌨️',
  86: '🌨️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
}

const CONDITION_LABEL: Record<number, string> = {
  0: 'Clear',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog possible',
  48: 'Fog possible',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
  56: 'Icy drizzle',
  57: 'Icy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Icy rain',
  67: 'Icy rain',
  71: 'Snow possible',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Showers',
  81: 'Showers',
  82: 'Violent showers',
  85: 'Snow showers',
  86: 'Snow showers',
  95: 'Thunderstorm risk',
  96: 'Storm w/ hail risk',
  99: 'Storm w/ hail risk',
}

const HINT_STYLES: Record<HintTone, string> = {
  cold: 'border-slate-blue/40 bg-slate-blue/20 text-blue-200',
  wet: 'border-forest-green/40 bg-forest-green/25 text-emerald-200',
  hot: 'border-amber/35 bg-amber/12 text-amber',
  alert: 'border-red-400/40 bg-red-400/10 text-red-300',
}

const RAIN_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]
const SNOW_OR_STORM_CODES = [71, 73, 75, 77, 85, 86, 95, 96, 99]

function toDisplay(celsius: number, unit: Unit): number {
  return unit === 'C' ? Math.round(celsius) : Math.round((celsius * 9) / 5 + 32)
}

function formatWind(kph: number, unit: Unit): string {
  return unit === 'C' ? `${Math.round(kph)} km/h` : `${Math.round(kph / 1.609344)} mph`
}

function formatPrecip(mm: number, unit: Unit): string {
  return unit === 'C' ? `${mm.toFixed(1)} mm` : `${(mm / 25.4).toFixed(2)} in`
}

function formatLocalTime(isoLocal?: string): string {
  const match = isoLocal?.match(/T(\d{2}):(\d{2})/)
  if (!match) return '—'
  const hour = Number(match[1])
  const suffix = hour >= 12 ? 'PM' : 'AM'
  return `${hour % 12 || 12}:${match[2]} ${suffix}`
}

function formatHours(hours?: number): string {
  if (hours == null) return '—'
  if (hours < 0.1) return 'Dry signal'
  return `${hours.toFixed(hours < 10 ? 1 : 0)} hr${hours === 1 ? '' : 's'}`
}

function formatRefreshTime(isoDateTime: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Europe/Vienna',
    timeZoneName: 'short',
  }).format(new Date(isoDateTime))
}

function compassDirection(degrees?: number): string {
  if (degrees == null) return ''
  const points = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return points[Math.round(degrees / 45) % points.length]
}

function conditionEmoji(code?: number): string {
  if (code == null) return '🗓️'
  return CONDITION_EMOJI[code] ?? '🗓️'
}

function conditionLabel(code?: number): string {
  if (code == null) return 'Early-autumn mix'
  return CONDITION_LABEL[code] ?? 'Mixed conditions'
}

function locationLabel(day: DayPlan): string {
  const name = day.weatherLocation?.name ?? 'Forecast point'
  const elevation = day.weatherLocation?.elevationM
  return elevation == null ? name : `${name} · ${elevation.toLocaleString('en-US')} m`
}

function forecastHorizon(day: DayPlan): { label: string; className: string } {
  const lead = day.weatherForecastLeadDays
  if (lead == null) {
    return {
      label: 'Forecast',
      className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    }
  }
  if (lead <= 3) {
    return {
      label: lead === 0 ? 'Today' : `${lead}-day short range`,
      className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    }
  }
  if (lead <= 7) {
    return {
      label: `${lead}-day planning range`,
      className: 'border-slate-blue/40 bg-slate-blue/20 text-blue-200',
    }
  }
  return {
    label: `${lead}-day early outlook`,
    className: 'border-amber/30 bg-amber/10 text-amber',
  }
}

function forecastHigh(day: DayPlan): number {
  return day.weatherExposure?.highC ?? day.weatherHighC ?? -99
}

function forecastLow(day: DayPlan): number {
  return day.weatherExposure?.lowC ?? day.weatherLowC ?? 99
}

function forecastFeelsHigh(day: DayPlan): number | undefined {
  return day.weatherExposure?.feelsHighC ?? day.weatherFeelsHighC
}

function forecastFeelsLow(day: DayPlan): number | undefined {
  return day.weatherExposure?.feelsLowC ?? day.weatherFeelsLowC
}

function forecastPrecipPct(day: DayPlan): number | undefined {
  return day.weatherExposure?.precipPct ?? day.weatherPrecipPct
}

function forecastPrecipMm(day: DayPlan): number {
  return day.weatherExposure?.precipMm ?? day.weatherPrecipMm ?? 0
}

function forecastWindKph(day: DayPlan): number | undefined {
  return day.weatherExposure?.windKph ?? day.weatherWindKph
}

function forecastGustKph(day: DayPlan): number | undefined {
  return day.weatherExposure?.gustKph ?? day.weatherGustKph
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`
}

/** Gear hints tie the forecast back to the day's actual outdoor plan. */
function gearHints(day: DayPlan): { label: string; tone: HintTone }[] {
  const hints: { label: string; tone: HintTone }[] = []
  const isAlpine = (day.weatherLocation?.elevationM ?? 0) >= 1500
  const coldestFeels = forecastFeelsLow(day) ?? forecastLow(day)
  const precipPct = forecastPrecipPct(day)
  const precipMm = forecastPrecipMm(day)
  const gustKph = forecastGustKph(day)
  const hasRainCode = day.weatherCode != null && RAIN_CODES.includes(day.weatherCode)

  if (day.weatherCode != null && SNOW_OR_STORM_CODES.includes(day.weatherCode)) {
    hints.push({ label: 'Recheck trail or lift status', tone: 'alert' })
  }
  if (isAlpine && (day.weatherForecastLeadDays ?? 0) > 7) {
    hints.push({ label: 'Recheck mountain forecast 24–48h ahead', tone: 'alert' })
  }
  if (isAlpine && (precipMm >= 5 || (gustKph ?? 0) >= 50)) {
    hints.push({ label: 'Keep the lower-elevation fallback ready', tone: 'alert' })
  }
  if ((gustKph ?? 0) >= 40) hints.push({ label: 'Exposed-route wind check', tone: 'alert' })
  if (coldestFeels <= 7) hints.push({ label: 'Insulation + hat + gloves', tone: 'cold' })
  if (
    hasRainCode ||
    (precipPct ?? 0) >= 35 ||
    precipMm >= 1 ||
    (!day.weatherExposure && (day.weatherPrecipHours ?? 0) >= 2)
  ) {
    hints.push({ label: 'Waterproof shell + pack liner', tone: 'wet' })
  }
  if (isAlpine && (hasRainCode || precipMm >= 2)) {
    hints.push({ label: 'Pack rain pants', tone: 'wet' })
  }
  if (forecastHigh(day) >= 27) hints.push({ label: 'Breathable layer + extra water', tone: 'hot' })
  if (isAlpine || (day.weatherUvMax ?? 0) >= 5 || forecastHigh(day) >= 25) {
    hints.push({ label: 'Sunscreen + sunglasses', tone: 'hot' })
  }
  return hints
}

function WeatherMetric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-forest-green/15 bg-dark-surface/35 px-3 py-2.5 min-w-0">
      <div className="text-[9px] uppercase tracking-[0.2em] text-cream-muted/55">{label}</div>
      <div className="mt-1 text-sm font-medium text-cream leading-tight">{value}</div>
      {detail && <div className="mt-0.5 text-[11px] text-cream-muted/65 leading-snug">{detail}</div>}
    </div>
  )
}

export function TripWeatherOutlook() {
  const { days, error, isLoading, isRefreshing, refreshedAt, refresh } = useLiveWeather()
  const unit = useSyncExternalStore(subscribeToUnit, getUnitSnapshot, getServerUnit)

  const changeUnit = (next: Unit) => {
    window.localStorage.setItem(UNIT_STORAGE_KEY, next)
    window.dispatchEvent(new Event(UNIT_EVENT))
  }

  const orderedDays = useMemo(() => [...days].sort((a, b) => a.isoDate.localeCompare(b.isoDate)), [days])
  const liveDays = useMemo(
    () => orderedDays.filter((day) => day.weatherSource === 'forecast' && day.weatherHighC != null),
    [orderedDays],
  )

  const highlights = useMemo(() => {
    if (!liveDays.length) return null
    const warmest = liveDays.reduce((a, b) => (forecastHigh(b) > forecastHigh(a) ? b : a))
    const coldest = liveDays.reduce((a, b) =>
      (forecastFeelsLow(b) ?? forecastLow(b)) < (forecastFeelsLow(a) ?? forecastLow(a)) ? b : a,
    )
    const wettest = liveDays.reduce((a, b) => {
      const aRain = forecastPrecipMm(a)
      const bRain = forecastPrecipMm(b)
      if (aRain !== bRain) return bRain > aRain ? b : a
      return (forecastPrecipPct(b) ?? -1) > (forecastPrecipPct(a) ?? -1) ? b : a
    })
    return { warmest, coldest, wettest }
  }, [liveDays])

  const unitButton = (value: Unit) => (
    <button
      type="button"
      onClick={() => changeUnit(value)}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        unit === value ? 'bg-amber text-dark-surface' : 'border border-slate-blue/40 text-cream-muted hover:text-cream'
      }`}
      aria-pressed={unit === value}
    >
      °{value}
    </button>
  )

  return (
    <section id={HOME_SECTION_IDS.weatherOutlook} className="px-6 pb-20 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-amber/60" />
          <span className="text-amber text-sm tracking-[0.3em] uppercase font-medium">Weather Outlook</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="flex items-center gap-1.5" aria-label="Weather units">
            {unitButton('F')}
            {unitButton('C')}
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={isRefreshing}
            className="rounded-md border border-amber/35 px-2.5 py-1 text-xs font-medium text-amber transition-colors hover:border-amber/60 hover:text-cream disabled:cursor-wait disabled:opacity-60"
          >
            {isRefreshing ? 'Checking…' : 'Check for update'}
          </button>
        </div>
      </div>

      <p className="text-cream-muted max-w-3xl text-sm leading-relaxed mb-5">
        Forecasts load separately from the static itinerary. The browser checks every {WEATHER_REFRESH_MINUTES} minutes
        while this page is open, and the server shares that forecast cache so open tabs do not multiply Open-Meteo
        requests. Exposed itinerary days use explicit summit or hut elevations instead of a warmer valley proxy.
        Outlooks beyond seven days are useful for choosing gear, but exact rain, wind, trail, and lift decisions still
        need a 24–48 hour recheck.
      </p>

      <div className="mb-5 flex items-center gap-2 text-xs" aria-live="polite">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 font-medium ${
            error
              ? 'border-amber/25 bg-amber/10 text-amber'
              : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
          }`}
        >
          {isLoading
            ? 'Loading the latest forecast…'
            : refreshedAt
              ? `Checked ${formatRefreshTime(refreshedAt)}`
              : 'Seasonal guidance loaded'}
        </span>
        {error && <span className="text-cream-muted/70">{error}</span>}
      </div>

      {highlights && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {[
            {
              label: 'Warmest afternoon',
              day: highlights.warmest,
              value: `${toDisplay(forecastHigh(highlights.warmest), unit)}°${unit}`,
            },
            {
              label: 'Coldest planned exposure',
              day: highlights.coldest,
              value: `${toDisplay(forecastFeelsLow(highlights.coldest) ?? forecastLow(highlights.coldest), unit)}°${unit}`,
            },
            {
              label: 'Wettest relevant window',
              day: highlights.wettest,
              value: formatPrecip(forecastPrecipMm(highlights.wettest), unit),
            },
          ].map(({ label, day, value }) => (
            <div key={label} className="rounded-lg border border-slate-blue/30 bg-slate-blue/12 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.22em] text-blue-200 font-medium">{label}</div>
              <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                <span className="text-xl font-semibold text-cream">{value}</span>
                <span className="text-sm text-cream-muted">
                  {day.date} · {locationLabel(day)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {orderedDays.map((day) => {
          const isLive = day.weatherSource === 'forecast' && day.weatherHighC != null
          const hints = isLive ? gearHints(day) : []
          const windDirection = compassDirection(day.weatherWindDirectionDeg)
          const horizon = forecastHorizon(day)
          const highC = forecastHigh(day)
          const lowC = forecastLow(day)
          const feelsHighC = forecastFeelsHigh(day)
          const feelsLowC = forecastFeelsLow(day)
          const precipPct = forecastPrecipPct(day)
          const precipMm = forecastPrecipMm(day)
          const windKph = forecastWindKph(day)
          const gustKph = forecastGustKph(day)

          return (
            <article
              key={day.isoDate}
              className={`rounded-xl border p-4 flex flex-col ${
                isLive ? 'bg-dark-card border-slate-blue/30' : 'bg-dark-card/50 border-forest-green/15'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-cream font-medium leading-tight">
                    {day.date} · {day.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-cream-muted/70 truncate">{locationLabel(day)}</div>
                </div>
                <span className="text-2xl leading-none" role="img" aria-label={conditionLabel(day.weatherCode)}>
                  {isLive ? conditionEmoji(day.weatherCode) : '⏳'}
                </span>
              </div>

              {isLive ? (
                <>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-serif-display text-cream">
                          {toDisplay(highC, unit)}°
                        </span>
                        <span className="text-lg text-cream-muted">{toDisplay(lowC, unit)}°</span>
                        <span className="text-[9px] uppercase tracking-widest text-cream-muted/50">
                          {day.weatherExposure ? 'Planned high · low' : 'High · low'}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-cream-muted">
                        {day.weatherExposure
                          ? `Full-day signal · ${conditionLabel(day.weatherCode)}`
                          : conditionLabel(day.weatherCode)}
                      </div>
                      {day.weatherExposure && (
                        <div className="mt-1 text-[11px] text-blue-200/80">
                          {day.weatherExposure.label} · {formatHour(day.weatherExposure.startHour)}–
                          {formatHour(day.weatherExposure.endHour)}
                        </div>
                      )}
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${horizon.className}`}
                    >
                      {horizon.label}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <WeatherMetric
                      label="Feels like"
                      value={
                        feelsHighC == null
                          ? '—'
                          : `${toDisplay(feelsHighC, unit)}° / ${toDisplay(feelsLowC ?? feelsHighC, unit)}°`
                      }
                      detail={day.weatherExposure ? 'Across the planned window' : 'Afternoon / overnight'}
                    />
                    <WeatherMetric
                      label="Precipitation"
                      value={`${precipPct == null ? 'Chance n/a' : `${precipPct}%`} · ${formatPrecip(precipMm, unit)}`}
                      detail={day.weatherExposure ? 'Planned-window total' : formatHours(day.weatherPrecipHours)}
                    />
                    <WeatherMetric
                      label="Wind"
                      value={
                        windKph == null
                          ? '—'
                          : `${day.weatherExposure || !windDirection ? '' : `${windDirection} `}${formatWind(windKph, unit)}`
                      }
                      detail={
                        day.weatherExposure
                          ? gustKph == null
                            ? 'Peak in planned window'
                            : `Peak window · gusts ${formatWind(gustKph, unit)}`
                          : gustKph == null
                            ? undefined
                            : `Gusts ${formatWind(gustKph, unit)}`
                      }
                    />
                    <WeatherMetric
                      label="UV max"
                      value={day.weatherUvMax == null ? '—' : day.weatherUvMax.toFixed(1)}
                      detail={
                        (day.weatherUvMax ?? 0) >= 5 || (day.weatherLocation?.elevationM ?? 0) >= 1500
                          ? 'Sun protection needed'
                          : 'Lower exposure'
                      }
                    />
                    {day.weatherExposure && (
                      <WeatherMetric
                        label="Full-day range"
                        value={`${toDisplay(day.weatherHighC!, unit)}° / ${toDisplay(day.weatherLowC!, unit)}°`}
                        detail="Includes hours outside your visit"
                      />
                    )}
                    <div className={day.weatherExposure ? '' : 'col-span-2'}>
                      <WeatherMetric
                        label="Local daylight"
                        value={`${formatLocalTime(day.weatherSunrise)} – ${formatLocalTime(day.weatherSunset)}`}
                        detail="Sunrise to sunset at the forecast location"
                      />
                    </div>
                  </div>

                  {day.weatherNote && (
                    <p className="mt-3 text-xs text-cream-muted/80 leading-relaxed">{day.weatherNote}</p>
                  )}

                  {hints.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-forest-green/15 flex flex-wrap gap-1.5">
                      {hints.map((hint) => (
                        <span
                          key={hint.label}
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${HINT_STYLES[hint.tone]}`}
                        >
                          {hint.label}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-3 flex flex-1 flex-col">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-cream-muted/50">
                    Typical September pattern
                  </div>
                  {day.weather && <p className="mt-2 text-sm text-cream-muted leading-relaxed">{day.weather}</p>}
                  {day.weatherNote && (
                    <p className="mt-2 text-xs text-cream-muted/75 leading-relaxed">{day.weatherNote}</p>
                  )}
                  {day.weatherUnlocks && (
                    <div className="mt-auto pt-4">
                      <span className="inline-flex rounded-full border border-amber/25 bg-amber/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-amber">
                        {day.weatherUnlocks}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>

      <p className="mt-4 text-xs text-cream-muted/55 leading-relaxed">
        Forecast data by{' '}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          className="text-amber/80 underline decoration-amber/30 underline-offset-4 hover:text-amber"
        >
          Open-Meteo
        </a>{' '}
        using national weather services and Copernicus datasets. Daily values describe the listed coordinate; mountain
        entries use an explicit summit or hut elevation but remain model guidance rather than an on-site observation.
      </p>
    </section>
  )
}
