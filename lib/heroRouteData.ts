/**
 * Shared constants for the hero map route.
 * Importable from both server (page.tsx) and client (HeroMap.tsx).
 */
import { PHASES } from './tripData'
import { DRIVING_SEGMENTS } from './data/transport'
import type { LatLng } from './routingService'

/**
 * Static coordinate overrides for Overpass segments that still stitch incorrectly.
 * Key format: "fromLat,fromLng->toLat,toLng" using the exact literal float values
 * from tripData.ts waypoints (copy-paste, do not compute — float arithmetic can
 * produce "47.812900000000001" which silently misses the lookup).
 *
 * If you need computed keys, normalize both sides with .toFixed(4).
 */
export const RAIL_SEGMENT_OVERRIDES: Record<string, LatLng[]> = {
  // Example entry (uncomment and populate if a segment misbehaves):
  // '48.1598,14.0285->48.0121,13.7214': [[48.1598, 14.0285], [48.0121, 13.7214]],
}

/**
 * Car-only waypoints in itinerary order. Derive them from the canonical driving
 * segments so the overview cannot silently retain an old pickup, stop, or return.
 */
export const DRIVE_WAYPOINTS: LatLng[] = DRIVING_SEGMENTS.flatMap((segment) =>
  (segment.waypoints ?? []).map(({ lat, lng }) => [lat, lng] as LatLng)
).filter(([lat, lng], index, points) => {
  const previous = points[index - 1]
  return !previous || previous[0] !== lat || previous[1] !== lng
})

/** All train segments across all phases, for the hero overview map. */
export const HERO_TRAIN_SEGMENTS = PHASES.flatMap((p) => p.trainSegments ?? [])
