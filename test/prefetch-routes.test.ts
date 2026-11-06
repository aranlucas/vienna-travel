import { expect, it } from "vitest";
import { STATIC_ROUTES } from "@/lib/static-routes";
import { prefetchRoutes } from "@/lib/route-prefetch";
import type { LatLng } from "@/lib/routing-service";

it("keeps driving geometry and original provenance together during a train-only refresh", async () => {
  const previous = {
    ...STATIC_ROUTES,
    sourceWaypointKeys: {
      ...STATIC_ROUTES.sourceWaypointKeys,
      heroDrive: "old waypoints",
      drivingRoutes: { previous: "old route" },
    },
  };

  const saved = await prefetchRoutes(
    true,
    {
      fetchDrivingRoute: () => {
        throw new Error("Driving must not refresh");
      },
      fetchRelationGeometry: () =>
        Promise.resolve(Array.from({ length: 100 }, (): LatLng => [0, 0])),
    },
    previous,
  );

  expect(saved.heroDriveCoords).toEqual(previous.heroDriveCoords);
  expect(saved.phaseRoutes).toEqual(previous.phaseRoutes);
  expect(saved.sourceWaypointKeys.heroDrive).toBe("old waypoints");
  expect(saved.sourceWaypointKeys.drivingRoutes).toEqual({ previous: "old route" });
});
