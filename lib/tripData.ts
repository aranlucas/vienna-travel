/**
 * lib/tripData.ts — assembly layer + re-export barrel
 *
 * Source of truth now lives in lib/data/:
 *   trip.ts · stays.ts · transport.ts · hikes.ts · pois.ts
 *   itinerary.ts · phases.ts · packing.ts · logistics.ts
 *
 * This file assembles the fat Phase objects (with days/pois/hikes/segments)
 * that existing components expect, and re-exports all types for backward compat.
 */

// ── Data imports ──────────────────────────────────────────────────────────────
import { TRIP_META } from './data/trip'
import { STAYS, CONFIRMED_STAYS } from './data/stays'
import { FLIGHT_SEGMENTS, DRIVING_SEGMENTS, TRAIN_SEGMENTS } from './data/transport'
import { HIKES } from './data/hikes'
import { POIS } from './data/pois'
import { DAYS } from './data/itinerary'
import { PHASE_DEFINITIONS } from './data/phases'
import { PACKING_PLAN } from './data/packing'
import { BOOKINGS, CHECKLIST, LIVE_CHECKS, PLANNING_SHORTLIST } from './data/logistics'

// ── Re-export types for backward compat ──────────────────────────────────────
export type { Coordinates } from './data/trip'
export type { Difficulty, ElevationPoint, Hike } from './data/hikes'
export type { PointOfInterest } from './data/pois'
export type {
  ActivityType,
  DayActivity,
  DayPlan,
  DayRoute,
  DayWeatherLocation,
  DayWeatherWindow,
  WeatherExposureForecast,
} from './data/itinerary'
export type { DrivingSegment, TrainSegment } from './data/transport'
export type { PackingGroup, PackingPlan } from './data/packing'
export type { BookingItem, PlanningOption, PlanningShortlistItem, LiveCheckItem } from './data/logistics'

// Re-export data constants consumed directly by components/pages
export { BOOKINGS, LIVE_CHECKS, PLANNING_SHORTLIST }

// ── Phase interface (fat, for backward compat) ────────────────────────────────
import type { Coordinates } from './data/trip'
import type { Hike } from './data/hikes'
import type { PointOfInterest } from './data/pois'
import type { DayPlan, DayRoute } from './data/itinerary'
import type { DrivingSegment, TrainSegment } from './data/transport'

export interface Phase {
  id: string
  number: 1 | 2 | 3 | 4
  title: string
  subtitle: string
  dates: string
  emoji: string
  mapCenter: Coordinates
  mapZoom: number
  pois: PointOfInterest[]
  hikes: Hike[]
  drivingSegments: DrivingSegment[]
  trainSegments?: TrainSegment[]
  days: DayPlan[]
  overviewRoute: Coordinates[]
  dayRoutes?: DayRoute[]
  suggestedStopIds?: string[]
}

// ── Assemble fat PHASES from thin definitions + flat data ─────────────────────
function withoutPhaseId<T extends { phaseId: string }>({ phaseId, ...value }: T): Omit<T, 'phaseId'> {
  void phaseId
  return value
}

export const PHASES: Phase[] = PHASE_DEFINITIONS.map((def) => {
  const phasePois: PointOfInterest[] = Object.values(POIS)
    .filter((p) => p.phaseId === def.id)
    .map(withoutPhaseId)

  const phaseHikes: Hike[] = Object.values(HIKES)
    .filter((h) => h.phaseId === def.id)
    .map(withoutPhaseId)

  const phaseDriving: DrivingSegment[] = DRIVING_SEGMENTS.filter((s) => s.phaseId === def.id).map(withoutPhaseId)

  const phaseTrains: TrainSegment[] = TRAIN_SEGMENTS.filter((s) => s.phaseId === def.id).map(withoutPhaseId)

  const phaseDays: DayPlan[] = Object.values(DAYS)
    .filter((d) => d.phaseId === def.id)
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate))

  return {
    ...def,
    pois: phasePois,
    hikes: phaseHikes,
    drivingSegments: phaseDriving,
    trainSegments: phaseTrains.length > 0 ? phaseTrains : undefined,
    days: phaseDays,
  }
})

// ── FlightInfo (backward compat shape used by HeroSection + app/page.tsx) ─────
export interface FlightInfo {
  airline: string
  flightNumbers: string[]
  departure: { airport: string; datetime: string }
  arrival: { airport: string; datetime: string }
  layover: string
  cost?: string
  seatTip?: string
}

export const FLIGHT: FlightInfo = {
  airline: 'Example Air',
  flightNumbers: ['EX 100', 'EX 101'],
  departure: { airport: 'ORIGIN', datetime: 'Sept 4, 6:50 PM' },
  arrival: { airport: 'VIE', datetime: 'Sept 5, 4:35 PM (+1)' },
  layover: 'MUC (1h 50m)',
  seatTip: 'Fictional sample flights keep the UI realistic without publishing a real route or reservation.',
}

/** Vienna Airport coordinates (retained for POI refs in phase map). */
export const VIENNA_AIRPORT_COORDINATES: Coordinates = { lat: 48.1103, lng: 16.5697 }

// ── TRIP_DATA ─────────────────────────────────────────────────────────────────
export const TRIP_DATA = {
  ...TRIP_META,
  flight: FLIGHT,
  hotels: CONFIRMED_STAYS,
  phases: PHASES,
  bookings: BOOKINGS,
  planningShortlist: PLANNING_SHORTLIST,
  liveChecks: LIVE_CHECKS,
  packing: PACKING_PLAN,
  checklist: CHECKLIST,
}

// ── Unused imports kept for tree-shaking (STAYS is used in timelineEvents) ────
export { STAYS }
export { FLIGHT_SEGMENTS, DRIVING_SEGMENTS, TRAIN_SEGMENTS }
