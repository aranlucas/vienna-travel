import { PHASES } from "./tripData";
import { fetchDrivingRoute } from "./routing-service";
import type { LatLng } from "./routing-service";
import { DRIVE_WAYPOINTS, HERO_TRAIN_SEGMENTS } from "./hero-route-data";
import {
  routeWaypointKey,
  STATIC_ROUTES,
  phaseRoutesSchema,
  type StaticRoutes,
} from "./static-routes";
import { fetchRelationGeometry } from "./overpass-rail-service";

const DEFAULT_SERVICES = { fetchDrivingRoute, fetchRelationGeometry };

export async function prefetchRoutes(
  trainOnly: boolean,
  services: RouteServices = DEFAULT_SERVICES,
  previous: StaticRoutes = STATIC_ROUTES,
) {
  let heroDriveCoords = previous.heroDriveCoords;
  let phaseRoutes = previous.phaseRoutes;

  if (!trainOnly) {
    heroDriveCoords = await services.fetchDrivingRoute(DRIVE_WAYPOINTS);

    if (heroDriveCoords.length <= DRIVE_WAYPOINTS.length) {
      throw new Error(
        "Hero drive: OSRM did not return road-following geometry; static routes were not changed",
      );
    }

    const phaseResults = await Promise.all(
      PHASES.map(async (phase) => {
        const drivingEntries = await Promise.all(
          phase.drivingSegments
            .filter((s) => s.waypoints && s.waypoints.length >= 2)
            .map(async (s) => {
              if (!s.waypoints) {
                throw new Error(`${s.id}: missing driving waypoints`);
              }

              const wpts: LatLng[] = s.waypoints.map((c) => [c.lat, c.lng]);
              const route = await services.fetchDrivingRoute(wpts);

              if (route.length <= wpts.length) {
                throw new Error(
                  `${phase.id}/${s.id}: OSRM did not return road-following geometry; static routes were not changed`,
                );
              }

              return [s.id, route] satisfies RouteEntry;
            }),
        );

        return [phase.id, { drivingRoutes: Object.fromEntries(drivingEntries) }] as const;
      }),
    );

    phaseRoutes = phaseRoutesSchema.parse(Object.fromEntries(phaseResults));
  }

  const heroTrainEntries = await Promise.all(
    HERO_TRAIN_SEGMENTS.map(async (segment) => {
      const from = segment.waypoints[0];
      const to = segment.waypoints.at(-1);

      if (segment.relationId === null || segment.relationId === undefined || !from || !to) {
        throw new Error(`${segment.id}: missing OSM relationId; bbox rail stitcher was removed`);
      }

      const route = await services.fetchRelationGeometry(segment.relationId, from, to);

      if (route.length <= segment.waypoints.length) {
        throw new Error(
          `${segment.id}: OSM did not return rail-following geometry; static routes were not changed`,
        );
      }

      return [segment.id, route] satisfies RouteEntry;
    }),
  );

  const heroTrainRoutes = Object.fromEntries(heroTrainEntries);

  const sourceWaypointKeys = {
    heroDrive: trainOnly
      ? previous.sourceWaypointKeys.heroDrive
      : routeWaypointKey(DRIVE_WAYPOINTS),
    drivingRoutes: trainOnly
      ? previous.sourceWaypointKeys.drivingRoutes
      : Object.fromEntries(
          PHASES.flatMap((phase) =>
            phase.drivingSegments
              .filter((segment) => segment.waypoints && segment.waypoints.length >= 2)
              .map((segment) => [
                segment.id,
                routeWaypointKey(
                  (segment.waypoints ?? []).map(({ lat, lng }) => [lat, lng] satisfies LatLng),
                ),
              ]),
          ),
        ),
    trainRoutes: Object.fromEntries(
      HERO_TRAIN_SEGMENTS.map((segment) => [
        segment.id,
        `${segment.relationId ?? ""}:${routeWaypointKey(segment.waypoints.map(({ lat, lng }) => [lat, lng] satisfies LatLng))}`,
      ]),
    ),
  };

  const data: StaticRoutes = {
    sourceWaypointKeys,
    heroDriveCoords,
    heroTrainRoutes,
    phaseRoutes,
  };

  return data;
}

type RouteEntry = [string, LatLng[]];

type RouteServices = {
  fetchDrivingRoute: typeof fetchDrivingRoute;
  fetchRelationGeometry: typeof fetchRelationGeometry;
};
