'use client'

import { useLiveWeatherDays } from '@/components/weather/LiveWeatherProvider'
import type { DayPlan } from '@/lib/tripData'

function formatTemperature(celsius: number): string {
  return `${Math.round(celsius)}°C / ${Math.round((celsius * 9) / 5 + 32)}°F`
}

function formatLocation(day: DayPlan): string {
  const name = day.weatherLocation?.name ?? day.title
  const elevation = day.weatherLocation?.elevationM
  return elevation == null ? name : `${name} at ${elevation.toLocaleString('en-US')} m`
}

function forecastHigh(day: DayPlan): number {
  return day.weatherExposure?.highC ?? day.weatherHighC ?? -99
}

function forecastFeelsLow(day: DayPlan): number {
  return day.weatherExposure?.feelsLowC ?? day.weatherExposure?.lowC ?? day.weatherFeelsLowC ?? day.weatherLowC ?? 99
}

function forecastRainMm(day: DayPlan): number {
  return day.weatherExposure?.precipMm ?? day.weatherPrecipMm ?? 0
}

function forecastRainPct(day: DayPlan): number | undefined {
  return day.weatherExposure?.precipPct ?? day.weatherPrecipPct
}

function forecastGustKph(day: DayPlan): number | undefined {
  return day.weatherExposure?.gustKph ?? day.weatherGustKph
}

function forecastPackingSummary(days: DayPlan[]) {
  const forecastDays = days.filter((day) => day.weatherSource === 'forecast' && day.weatherHighC != null)
  if (!forecastDays.length) {
    return {
      status: 'Live forecast data is temporarily unavailable, so use the all-conditions packing list below.',
      signals: [] as { label: string; value: string; detail: string }[],
    }
  }

  const warmest = forecastDays.reduce((a, b) => (forecastHigh(b) > forecastHigh(a) ? b : a))
  const coldest = forecastDays.reduce((a, b) => (forecastFeelsLow(b) < forecastFeelsLow(a) ? b : a))
  const wettest = forecastDays.reduce((a, b) => {
    const aRain = forecastRainMm(a)
    const bRain = forecastRainMm(b)
    if (bRain !== aRain) return bRain > aRain ? b : a
    return (forecastRainPct(b) ?? -1) > (forecastRainPct(a) ?? -1) ? b : a
  })
  const gustDays = forecastDays.flatMap((day) => {
    const gustKph = forecastGustKph(day)
    return gustKph == null ? [] : [{ day, gustKph }]
  })
  const windiest = gustDays.length ? gustDays.reduce((a, b) => (b.gustKph > a.gustKph ? b : a)) : undefined
  const earlyOutlooks = forecastDays.filter((day) => (day.weatherForecastLeadDays ?? 0) > 7).length
  const wettestChance = forecastRainPct(wettest)
  const rainChance = wettestChance == null ? 'chance not supplied' : `${wettestChance}% max chance`

  return {
    status: `${forecastDays.length} of ${days.length} trip days have a forecast. ${earlyOutlooks} later-trip outlook${earlyOutlooks === 1 ? ' is' : 's are'} more than a week out, so use them to choose gear and recheck the exact day plan 24–48 hours ahead.`,
    signals: [
      {
        label: 'Warm end of the range',
        value: formatTemperature(forecastHigh(warmest)),
        detail: `${warmest.date} · ${formatLocation(warmest)}. Keep one breathable hot-weather outfit and carry water on arrival and valley days.`,
      },
      {
        label: 'Coldest planned exposure',
        value: formatTemperature(forecastFeelsLow(coldest)),
        detail: `${coldest.date} · ${formatLocation(coldest)} feels-like low during ${coldest.weatherExposure?.label ?? 'the day'}. This is why fleece, packable insulation, shell, hat, and gloves all stay in the bag.`,
      },
      {
        label: 'Wettest current signal',
        value: `${forecastRainMm(wettest).toFixed(1)} mm · ${rainChance}`,
        detail: `${wettest.date} · ${formatLocation(wettest)}${wettest.weatherExposure ? ' during the planned window' : ''}. Take the shell, rain pants, and pack liner even if the valley starts dry.`,
      },
      ...(windiest
        ? [
            {
              label: 'Strongest gust signal',
              value: `${windiest.gustKph} km/h / ${Math.round(windiest.gustKph / 1.609344)} mph`,
              detail: `${windiest.day.date} · ${formatLocation(windiest.day)}. Secure loose items and keep the railway or lift operating-status check.`,
            },
          ]
        : []),
    ],
  }
}

export function ForecastPackingSummary({ days }: { days: DayPlan[] }) {
  const liveDays = useLiveWeatherDays(days)
  const forecast = forecastPackingSummary(liveDays)

  return (
    <div className="mt-6 rounded-xl border border-slate-blue/35 bg-slate-blue/12 p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-blue-200 tracking-[0.22em] uppercase font-medium">
          Forecast-Adjusted Final Call
        </div>
        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300">
          Refreshes with weather
        </span>
      </div>
      <p className="mt-2 max-w-4xl text-sm text-cream-muted leading-relaxed">{forecast.status}</p>

      {forecast.signals.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {forecast.signals.map((signal) => (
            <div key={signal.label} className="rounded-lg border border-slate-blue/25 bg-dark-surface/35 p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-cream-muted/60">{signal.label}</div>
              <div className="mt-1 text-base font-medium text-cream">{signal.value}</div>
              <p className="mt-1 text-xs text-cream-muted/75 leading-relaxed">{signal.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
