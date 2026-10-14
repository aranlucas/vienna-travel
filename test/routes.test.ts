import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchRelationGeometry } from "@/lib/overpass-rail-service";
import { fetchDrivingRoute, type LatLng } from "@/lib/routing-service";
import { assertStaticRoutesCurrent } from "@/lib/static-routes";

const from = { lat: 0, lng: 0 };

const to = { lat: 2, lng: 2 };

const route: LatLng[] = [
  [0, 0],
  [1, 1],
  [2, 2],
];

function osmFixture() {
  return {
    elements: [
      { type: "node", id: 1, lat: 0, lon: 0 },
      { type: "node", id: 2, lat: 1, lon: 1 },
      { type: "node", id: 3, lat: 2, lon: 2 },
      { type: "way", id: 10, nodes: [1, 2] },
      { type: "way", id: 11, nodes: [3, 2] },
      {
        type: "relation",
        id: 100,
        members: [
          { type: "way", ref: 10, role: "" },
          { type: "way", ref: 11, role: "" },
        ],
      },
    ],
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("rail geometry", () => {
  it("connects reversed way segments without duplicating their shared endpoint", async () => {
    const fixture = osmFixture();
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValue(Response.json(fixture)));
    await expect(fetchRelationGeometry(100, from, to)).resolves.toEqual(route);
    expect(fixture).toEqual(osmFixture());
  });

  it("orients the same relation toward a reverse journey", async () => {
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValue(Response.json(osmFixture())));
    await expect(fetchRelationGeometry(100, to, from)).resolves.toEqual(route.toReversed());
  });

  it.each([
    { elements: [] },
    { elements: [{ type: "way", id: 10, nodes: [] }] },
    { elements: [{ type: "relation", id: 100, members: [] }] },
    { elements: [{ type: "node", id: 1, lat: "invalid", lon: 0 }] },
    { unexpected: "payload" },
  ])("falls back safely for missing or malformed relation geometry: %j", async (payload) => {
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValue(Response.json(payload)));
    await expect(fetchRelationGeometry(100, from, to)).resolves.toEqual([]);
  });
});

describe("driving geometry", () => {
  it("converts longitude/latitude wire coordinates to Leaflet latitude/longitude", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({
          routes: [
            {
              geometry: {
                coordinates: [
                  [16, 48],
                  [17, 49],
                ],
              },
            },
          ],
        }),
      ),
    );
    await expect(fetchDrivingRoute(route)).resolves.toEqual([
      [48, 16],
      [49, 17],
    ]);
  });

  it("keeps the original waypoints when a provider response is malformed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(Response.json({ routes: null })),
    );
    await expect(fetchDrivingRoute(route)).resolves.toBe(route);
  });

  it("does not fetch for a journey with fewer than two points", async () => {
    const fetcher = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetcher);
    const single: LatLng[] = [[0, 0]];
    await expect(fetchDrivingRoute(single)).resolves.toBe(single);
    expect(fetcher).not.toHaveBeenCalled();
  });
});

it("keeps every checked-in route consistent with its canonical itinerary waypoints", () => {
  expect(() => assertStaticRoutesCurrent()).not.toThrow();
});
