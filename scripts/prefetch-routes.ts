import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { PHASES } from '../lib/tripData'
import { fetchDrivingRoute } from '../lib/routingService'
import type { LatLng } from '../lib/routingService'
import { DRIVE_WAYPOINTS, HERO_TRAIN_SEGMENTS } from '../lib/heroRouteData'
import { routeWaypointKey, STATIC_ROUTES, type StaticRoutes } from '../lib/staticRoutes'
import { fetchMultiSegmentRailRoute, fetchRelationGeometry } from '../lib/overpassRailService'

async function main() {
  const trainOnly = process.argv.includes('--train-only')
  let heroDriveCoords = STATIC_ROUTES.heroDriveCoords
  let phaseRoutes = STATIC_ROUTES.phaseRoutes

  if (!trainOnly) {
    console.log('Fetching hero driving route...')
    heroDriveCoords = await fetchDrivingRoute(DRIVE_WAYPOINTS)
    if (heroDriveCoords.length <= DRIVE_WAYPOINTS.length) {
      throw new Error('Hero drive: OSRM did not return road-following geometry; static routes were not changed')
    }

    console.log('Fetching per-phase driving routes...')
    const phaseResults = await Promise.all(
      PHASES.map(async (phase) => {
        const drivingEntries = await Promise.all(
          phase.drivingSegments
            .filter((s) => s.waypoints && s.waypoints.length >= 2)
            .map(async (s) => {
              const wpts: LatLng[] = s.waypoints!.map((c) => [c.lat, c.lng])
              const route = await fetchDrivingRoute(wpts)
              if (route.length <= wpts.length) {
                throw new Error(
                  `${phase.id}/${s.id}: OSRM did not return road-following geometry; static routes were not changed`
                )
              }
              console.log(`  ${phase.id}/${s.id}: ${route.length} points`)
              return [s.id, route] as [string, LatLng[]]
            })
        )
        return [phase.id, { drivingRoutes: Object.fromEntries(drivingEntries) }] as const
      })
    )
    phaseRoutes = Object.fromEntries(phaseResults) as StaticRoutes['phaseRoutes']
  } else {
    console.log('Keeping existing static driving routes (--train-only)')
  }

  console.log('Fetching hero train routes...')
  const heroTrainEntries = await Promise.all(
    HERO_TRAIN_SEGMENTS.map(async (segment) => {
      const from = segment.waypoints[0]
      const to = segment.waypoints[segment.waypoints.length - 1]
      const route = segment.relationId
        ? await fetchRelationGeometry(segment.relationId, from, to)
        : await fetchMultiSegmentRailRoute(segment.waypoints)
      if (route.length <= segment.waypoints.length) {
        throw new Error(
          `${segment.id}: OSM did not return rail-following geometry; static routes were not changed`
        )
      }
      console.log(`  ${segment.id}: ${route.length} points`)
      return [segment.id, route] as [string, LatLng[]]
    })
  )
  const heroTrainRoutes = Object.fromEntries(heroTrainEntries)

  const sourceWaypointKeys = {
    heroDrive: routeWaypointKey(DRIVE_WAYPOINTS),
    drivingRoutes: Object.fromEntries(
      PHASES.flatMap((phase) =>
        phase.drivingSegments
          .filter((segment) => segment.waypoints && segment.waypoints.length >= 2)
          .map((segment) => [
            segment.id,
            routeWaypointKey(segment.waypoints!.map(({ lat, lng }) => [lat, lng] as LatLng)),
          ])
      )
    ),
    trainRoutes: Object.fromEntries(
      HERO_TRAIN_SEGMENTS.map((segment) => [
        segment.id,
        `${segment.relationId ?? 'network'}:${routeWaypointKey(
          segment.waypoints.map(({ lat, lng }) => [lat, lng] as LatLng)
        )}`,
      ])
    ),
  }

  const data: StaticRoutes = {
    sourceWaypointKeys,
    heroDriveCoords,
    heroTrainRoutes,
    phaseRoutes,
  }

  const outPath = resolve(process.cwd(), 'lib/staticRoutes.json')
  await writeFile(outPath, JSON.stringify(data, null, 2))
  console.log(`\nWritten ${outPath}`)
  console.log(`Hero: ${heroDriveCoords.length} pts | Phases: ${PHASES.map((p) => p.id).join(', ')}`)
}

main().catch((err) => { console.error(err); process.exit(1) })
