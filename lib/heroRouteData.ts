/**
 * Shared constants for the hero map route.
 * Importable from both server (page.tsx) and client (HeroMap.tsx).
 */
import { PHASES } from './tripData'
import { DRIVING_SEGMENTS } from './data/transport'
import type { LatLng } from './routingService'

/**
 * Car-only waypoints in itinerary order. Derive them from the canonical driving
 * segments so the overview cannot silently retain an old pickup, stop, or return.
 */
export const DRIVE_WAYPOINTS: LatLng[] = DRIVING_SEGMENTS.flatMap((segment) =>
  (segment.waypoints ?? []).map(({ lat, lng }) => [lat, lng] as LatLng),
).filter(([lat, lng], index, points) => {
  const previous = points[index - 1]
  return !previous || previous[0] !== lat || previous[1] !== lng
})

/** All train segments across all phases, for the hero overview map. */
export const HERO_TRAIN_SEGMENTS = PHASES.flatMap((p) => p.trainSegments ?? []).filter(
  (segment) => segment.waypoints.length >= 2,
)
