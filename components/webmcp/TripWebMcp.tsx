'use client'

import { initializeWebMCPPolyfill } from '@mcp-b/webmcp-polyfill'
import { useWebMCP } from 'usewebmcp'
import type { BookingItem, DayPlan, LiveCheckItem } from '@/lib/tripData'
import { useLiveWeatherDays } from '@/components/weather/LiveWeatherProvider'

if (typeof document !== 'undefined') {
  initializeWebMCPPolyfill()
}

const NO_INPUT_SCHEMA = {
  type: 'object',
  properties: {},
  additionalProperties: false,
} as const

const DAY_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    date_or_day: {
      type: 'string',
      description: 'A trip date, date label, day title, or day number, such as 2037-09-10, Sept 10, or Day 6.',
    },
  },
  required: ['date_or_day'],
  additionalProperties: false,
} as const

const WEATHER_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    date_or_day: {
      type: 'string',
      description: 'Optional trip date, date label, day title, or day number. Omit it for the full outlook.',
    },
  },
  additionalProperties: false,
} as const

const SEARCH_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    query: {
      type: 'string',
      description: 'Plain-language search text, such as Hallstatt, rental car, rain, hike, dinner, or airport.',
      minLength: 2,
    },
  },
  required: ['query'],
  additionalProperties: false,
} as const

const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  idempotentHint: true,
  openWorldHint: false,
  untrustedContentHint: false,
} as const

type PhaseSummary = {
  id: string
  title: string
  dates: string
  subtitle: string
}

type TripSummary = {
  title: string
  subtitle: string
  dates: string
  totalDays: number
  travelers: number
}

type TripWebMcpProps = {
  trip: TripSummary
  phases: PhaseSummary[]
  days: DayPlan[]
  bookings: BookingItem[]
  liveChecks: LiveCheckItem[]
}

function normalize(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function findDay(days: DayPlan[], input: string): DayPlan | undefined {
  const query = normalize(input)
  return days.find((day) => {
    const dayNumber = day.dayLabel.match(/Day\s+(\d+)/i)?.[1]
    return [day.isoDate, day.date, day.dayLabel, day.title, dayNumber ? `day ${dayNumber}` : '']
      .map(normalize)
      .some((candidate) => candidate === query || candidate.includes(query))
  })
}

function weatherForDay(day: DayPlan) {
  return {
    isoDate: day.isoDate,
    date: day.date,
    day: day.title,
    location: day.weatherLocation?.name,
    locationElevationM: day.weatherLocation?.elevationM,
    source: day.weatherSource,
    forecastLeadDays: day.weatherForecastLeadDays,
    plannedWindow: day.weatherWindow,
    plannedExposure: day.weatherExposure,
    summary: day.weather,
    guidance: day.weatherNote,
    highC: day.weatherHighC,
    lowC: day.weatherLowC,
    feelsHighC: day.weatherFeelsHighC,
    feelsLowC: day.weatherFeelsLowC,
    precipitationProbabilityPct: day.weatherPrecipPct,
    precipitationMm: day.weatherPrecipMm,
    precipitationHours: day.weatherPrecipHours,
    windKph: day.weatherWindKph,
    gustKph: day.weatherGustKph,
    windDirectionDegrees: day.weatherWindDirectionDeg,
    uvMax: day.weatherUvMax,
    sunriseLocal: day.weatherSunrise,
    sunsetLocal: day.weatherSunset,
    liveForecastOpens: day.weatherUnlocks,
  }
}

export function TripWebMcp({ trip, phases, days: staticDays, bookings, liveChecks }: TripWebMcpProps) {
  const days = useLiveWeatherDays(staticDays)

  useWebMCP({
    name: 'get_trip_overview',
    description:
      'Returns the Austria trip dates, phase sequence, booking status, and dated pre-departure checks. Use for a concise orientation to the existing plan.',
    inputSchema: NO_INPUT_SCHEMA,
    annotations: READ_ONLY_ANNOTATIONS,
    execute: async () => ({
      trip,
      phases,
      booked: bookings.filter((booking) => booking.booked),
      stillToBook: bookings.filter((booking) => !booking.booked),
      liveChecks,
    }),
  })

  useWebMCP({
    name: 'get_day_plan',
    description:
      'Returns the complete existing itinerary for one trip day, including timed activities, lodging, notes, carry list, and weather. Use when the user asks what happens on a specific day.',
    inputSchema: DAY_INPUT_SCHEMA,
    annotations: READ_ONLY_ANNOTATIONS,
    execute: async ({ date_or_day }) => {
      const day = findDay(days, date_or_day)
      if (!day) {
        throw new Error(
          `No trip day matched "${date_or_day}". Available dates are ${days.map((item) => item.isoDate).join(', ')}.`,
        )
      }
      return day
    },
  })

  useWebMCP({
    name: 'get_weather_outlook',
    description:
      'Returns the detailed weather outlook already loaded by the site, including full-day conditions and, on exposed mountain days, an hourly forecast aggregated across the planned activity window. Also includes source, forecast lead time, elevation, precipitation, wind, gusts, UV, and daylight. Use for trip-weather and packing questions.',
    inputSchema: WEATHER_INPUT_SCHEMA,
    annotations: READ_ONLY_ANNOTATIONS,
    execute: async ({ date_or_day }) => {
      if (!date_or_day) return days.map(weatherForDay)
      const day = findDay(days, date_or_day)
      if (!day) {
        throw new Error(
          `No trip day matched "${date_or_day}". Available dates are ${days.map((item) => item.isoDate).join(', ')}.`,
        )
      }
      return weatherForDay(day)
    },
  })

  useWebMCP({
    name: 'search_trip_plan',
    description:
      'Searches the existing itinerary, bookings, and live checks for a place, activity, transport detail, lodging, meal, hike, or planning topic. Use when the relevant day is unknown.',
    inputSchema: SEARCH_INPUT_SCHEMA,
    annotations: READ_ONLY_ANNOTATIONS,
    execute: async ({ query }) => {
      const normalizedQuery = normalize(query)
      if (normalizedQuery.length < 2) throw new Error('Search query must contain at least two characters.')

      const records = [
        ...days.map((day) => ({
          kind: 'day-plan',
          id: day.isoDate,
          title: `${day.date} · ${day.title}`,
          data: day,
        })),
        ...bookings.map((booking, index) => ({
          kind: 'booking',
          id: `booking-${index + 1}`,
          title: booking.item,
          data: booking,
        })),
        ...liveChecks.map((check) => ({
          kind: 'live-check',
          id: check.id,
          title: check.title,
          data: check,
        })),
      ]

      const matches = records
        .filter((record) => normalize(JSON.stringify(record)).includes(normalizedQuery))
        .slice(0, 20)

      return { query, totalMatches: matches.length, matches }
    },
  })

  return null
}
