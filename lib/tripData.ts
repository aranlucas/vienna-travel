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

import { TRIP_META } from './data/trip'
import { DRIVING_SEGMENTS, TRAIN_SEGMENTS } from './data/transport'
import { HIKES } from './data/hikes'
import { POIS } from './data/pois'
import { DAYS } from './data/itinerary'
import { PHASE_DEFINITIONS } from './data/phases'
import { BOOKINGS, CHECKLIST, LIVE_CHECKS, PLANNING_SHORTLIST } from './data/logistics'

export type { Coordinates } from './data/trip'
export type { Difficulty, ElevationPoint, Hike } from './data/hikes'
export type { PointOfInterest } from './data/pois'
export type { DayActivity, DayPlan, DayWeatherLocation } from './data/itinerary'
export type { DrivingSegment, TrainSegment } from './data/transport'
export type { PackingPlan } from './data/packing'
export type { BookingItem, PlanningShortlistItem, LiveCheckItem } from './data/logistics'

export { BOOKINGS, LIVE_CHECKS, PLANNING_SHORTLIST }

import type { Coordinates } from './data/trip'
import type { Hike } from './data/hikes'
import type { PointOfInterest } from './data/pois'
import type { DayPlan } from './data/itinerary'
import type { DayRoute } from './data/phases'
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
  dayRoutes?: DayRoute[]
  suggestedStopIds?: string[]
}

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

export const TRIP_DATA = {
  ...TRIP_META,
  phases: PHASES,
  checklist: CHECKLIST,
}
