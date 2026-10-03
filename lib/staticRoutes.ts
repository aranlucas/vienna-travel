import { z } from 'zod'
import type { LatLng } from './routingService'
import { DRIVING_SEGMENTS } from './data/transport'
import { PHASE_DEFINITIONS } from './data/phases'
import { DRIVE_WAYPOINTS, HERO_TRAIN_SEGMENTS } from './heroRouteData'
import data from './staticRoutes.json'

export interface StaticRoutes {
  sourceWaypointKeys: {
    heroDrive: string
    drivingRoutes: Record<string, string>
    trainRoutes: Record<string, string>
  }
  heroDriveCoords: LatLng[]
  /** Keyed by TrainSegment.id. Pre-baked Overpass rail geometry. */
  heroTrainRoutes: Record<string, LatLng[]>
  phaseRoutes: {
    vienna: { drivingRoutes: Record<string, LatLng[]> }
    salzkammergut: { drivingRoutes: Record<string, LatLng[]> }
    tyrol: { drivingRoutes: Record<string, LatLng[]> }
    olperer: { drivingRoutes: Record<string, LatLng[]> }
  }
}

const coordinate = z.tuple([z.number(), z.number()])

const routeGroup = z.object({ drivingRoutes: z.record(z.string(), z.array(coordinate)) })

export const phaseRoutesSchema = z.object({
  vienna: routeGroup,
  salzkammergut: routeGroup,
  tyrol: routeGroup,
  olperer: routeGroup,
})

const staticRoutesSchema = z.object({
  sourceWaypointKeys: z.object({
    heroDrive: z.string(),
    drivingRoutes: z.record(z.string(), z.string()),
    trainRoutes: z.record(z.string(), z.string()),
  }),
  heroDriveCoords: z.array(coordinate),
  heroTrainRoutes: z.record(z.string(), z.array(coordinate)),
  phaseRoutes: phaseRoutesSchema,
})

export const STATIC_ROUTES = staticRoutesSchema.parse(data)

const phaseGroups = new Map<string, StaticRoutes['phaseRoutes']['vienna']>(Object.entries(STATIC_ROUTES.phaseRoutes))

export function getStaticPhaseRoutes(id: string) {
  return phaseGroups.get(id)
}

export function routeWaypointKey(waypoints: LatLng[]): string {
  return waypoints.map(([lat, lng]) => `${lat},${lng}`).join(';')
}

/** Fail loudly when trip waypoints change without refreshing static OSRM data. */
export function assertStaticRoutesCurrent(): void {
  if (STATIC_ROUTES.sourceWaypointKeys.heroDrive !== routeWaypointKey(DRIVE_WAYPOINTS)) {
    throw new Error('Stale hero road geometry. Run npx tsx scripts/prefetch-routes.ts.')
  }

  for (const segment of HERO_TRAIN_SEGMENTS) {
    const waypoints = segment.waypoints.map(({ lat, lng }) => [lat, lng] satisfies LatLng)

    if (segment.relationId == null) {
      throw new Error(`Missing OSM relationId for ${segment.id}.`)
    }

    const sourceKey = `${segment.relationId}:${routeWaypointKey(waypoints)}`
    const route = STATIC_ROUTES.heroTrainRoutes[segment.id]

    if (
      !route ||
      route.length <= waypoints.length ||
      STATIC_ROUTES.sourceWaypointKeys.trainRoutes[segment.id] !== sourceKey
    ) {
      throw new Error(`Missing rail-following geometry for ${segment.id}. ` + 'Run npx tsx scripts/prefetch-routes.ts.')
    }
  }

  const currentTrainIds = new Set(HERO_TRAIN_SEGMENTS.map((segment) => segment.id))

  for (const routeId of Object.keys(STATIC_ROUTES.heroTrainRoutes)) {
    if (!currentTrainIds.has(routeId)) {
      throw new Error(`Stale rail geometry for ${routeId}. Run npx tsx scripts/prefetch-routes.ts.`)
    }
  }

  for (const phase of PHASE_DEFINITIONS) {
    if (!getStaticPhaseRoutes(phase.id)) {
      throw new Error(`Missing static route group for phase: ${phase.id}`)
    }
  }

  for (const segment of DRIVING_SEGMENTS) {
    if (!segment.waypoints?.length) continue

    const phase = getStaticPhaseRoutes(segment.phaseId)
    const route = phase?.drivingRoutes[segment.id]
    const waypoints = segment.waypoints.map(({ lat, lng }) => [lat, lng] satisfies LatLng)
    const sourceKey = STATIC_ROUTES.sourceWaypointKeys.drivingRoutes[segment.id]

    if (!route || route.length <= waypoints.length || sourceKey !== routeWaypointKey(waypoints)) {
      throw new Error(
        `Missing road-following geometry for ${segment.phaseId}/${segment.id}. ` +
          'Run npx tsx scripts/prefetch-routes.ts.',
      )
    }
  }

  for (const [phaseId, phase] of Object.entries(STATIC_ROUTES.phaseRoutes)) {
    const currentIds = new Set(DRIVING_SEGMENTS.flatMap((segment) => (segment.phaseId === phaseId ? [segment.id] : [])))

    for (const routeId of Object.keys(phase.drivingRoutes)) {
      if (!currentIds.has(routeId)) {
        throw new Error(`Stale road geometry for ${phaseId}/${routeId}. ` + 'Run npx tsx scripts/prefetch-routes.ts.')
      }
    }
  }
}
