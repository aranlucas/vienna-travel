# Next.js Architecture Improvements — Design Spec

**Date:** 2026-03-23
**Stack:** Next.js 16.2.1 · React 19.2 · TypeScript

---

## Scope

Three independent improvements to the vienna-travel app architecture:

1. Fix Overpass rail-route stitching for the hero map train lines
2. Pre-bake OSRM driving route coords as static JSON to eliminate build-time HTTP dependency
3. Migrate `PhaseNav` show/hide from `display:none/block` divs to React 19.2 `<Activity>`

---

## 1 — Fix Overpass Stitching

### Problem

`fetchRailRoute` in `lib/overpassRailService.ts` queries all OSM ways tagged `["railway"="rail"]["usage"="main"]` in a bounding box, then greedily stitches them into a polyline. The query returns service tracks, sidings, and parallel freight/slow lines alongside mainline passenger track. In dense areas (Linz/Wels corridor) the stitcher jumps between these and produces incorrect geometry (lines dipping into Styria).

### Fix A — Query filter

Add `[!"service"]` to the Overpass query to exclude service tracks, sidings, and yard tracks. Only ways with no `service` tag are returned, which are almost exclusively mainline passenger track.

**File:** `lib/overpassRailService.ts`

```diff
- way["railway"="rail"]["usage"="main"](${south},${west},${north},${east});out geom;
+ way["railway"="rail"]["usage"="main"][!"service"](${south},${west},${north},${east});out geom;
```

### Fix B — Per-segment overrides

For waypoint pairs where Overpass still produces wrong geometry after Fix A, add a static override mechanism. `heroRouteData.ts` exports a `RAIL_SEGMENT_OVERRIDES` map keyed by `"lat,lng->lat,lng"` strings. `fetchMultiSegmentRailRoute` checks this map for each adjacent waypoint pair before calling Overpass; if a match is found it uses the static coords and skips the API call for that segment.

This allows targeted manual corrections without touching the stitching algorithm.

**File:** `lib/heroRouteData.ts` — add export:
```ts
export const RAIL_SEGMENT_OVERRIDES: Record<string, LatLng[]> = {
  // Key format: "fromLat,fromLng->toLat,toLng"
  // Add entries here for any segment where Overpass still misbehaves
}
```

**File:** `lib/overpassRailService.ts` — `fetchMultiSegmentRailRoute` checks override map:
```ts
import { RAIL_SEGMENT_OVERRIDES } from './heroRouteData'

// In the per-segment loop:
const key = `${from.lat},${from.lng}->${to.lat},${to.lng}`
if (RAIL_SEGMENT_OVERRIDES[key]) return RAIL_SEGMENT_OVERRIDES[key]
// else fetch from Overpass as before
```

**Key precision:** Keys must use the exact literal float strings from the waypoint data in `tripData.ts` (copy the values verbatim, do not compute them). Floating-point arithmetic can produce representations like `47.812900000000001` that silently miss the lookup. If computed construction is required, normalize with `.toFixed(4)` consistently in both the key construction in `fetchMultiSegmentRailRoute` and the literal strings in `RAIL_SEGMENT_OVERRIDES`.

### Verification

After the fix, the hero map train polylines should follow the correct mainline track. Known problem segment: Wels Hbf → Attnang-Puchheim. If that segment still misbehaves, add its coords to `RAIL_SEGMENT_OVERRIDES`.

---

## 2 — Pre-bake OSRM Routes as Static JSON

### Problem

`page.tsx` calls `fetchDrivingRoute` (OSRM HTTP) at build time for: the hero driving route (1 call) and all per-phase driving segments (~6 calls across 4 phases). If `router.project-osrm.org` is unavailable, the build fails or returns straight-line fallbacks.

GPX hiking routes already read from local `fs` — no change needed.

### Solution

**Script:** `scripts/prefetch-routes.ts`

A one-off Node/tsx script that replicates the same OSRM calls as `page.tsx` and writes results to `lib/staticRoutes.json`. Run it manually whenever route waypoints change.

```
npx tsx scripts/prefetch-routes.ts
git add lib/staticRoutes.json && git commit -m "chore: refresh static OSRM routes"
```

**Output shape** (`lib/staticRoutes.json`):
```json
{
  "heroDriveCoords": [[47.8129, 13.0444], ...],
  "phaseRoutes": {
    "vienna": { "drivingRoutes": {} },
    "salzkammergut": { "drivingRoutes": { "seg-id": [[lat, lng], ...] } },
    "tyrol": { "drivingRoutes": { ... } },
    "olperer": { "drivingRoutes": { ... } }
  }
}
```

### Data contract

**`lib/staticRoutes.ts`** owns the `StaticRoutes` interface and exports a typed wrapper:

```ts
import type { LatLng } from './routingService'
import data from './staticRoutes.json'

export interface StaticRoutes {
  heroDriveCoords: LatLng[]
  phaseRoutes: {
    vienna: { drivingRoutes: Record<string, LatLng[]> }
    salzkammergut: { drivingRoutes: Record<string, LatLng[]> }
    tyrol: { drivingRoutes: Record<string, LatLng[]> }
    olperer: { drivingRoutes: Record<string, LatLng[]> }
  }
}

export const STATIC_ROUTES = data as StaticRoutes
```

Phase IDs are a closed set (`vienna`, `salzkammergut`, `tyrol`, `olperer`) — no index signature.

**`page.tsx` change:** Remove all `fetchDrivingRoute` calls. Import `STATIC_ROUTES` from `lib/staticRoutes.ts` and destructure `heroDriveCoords` and `phaseRoutes` directly. The entire OSRM async block is removed.

Hero train routes (Overpass) are unaffected — they remain live calls (improved by fix #1).

GPX hiking routes (`readGpxFile`) are unaffected — they read local `fs` files, no external HTTP.

`fetchHikingRoute` (foot profile) in `routingService.ts` is not used by `page.tsx` (phase hiking routes come from GPX files, not OSRM) — it is out of scope.

---

## 3 — PhaseNav: `display:none` → `<Activity>`

### Problem

`PhaseNav` (client component) toggles panels using `style={{ display: i === activeIndex ? 'block' : 'none' }}`. React 19.2 ships `<Activity>` specifically for this pattern — it renders children with `display: none` while preserving their state and correctly managing effect lifecycles.

### Change

**File:** `components/phases/PhaseNav.tsx`

```diff
+ import { Activity } from 'react'

  {panels.map((panel, i) => (
-   <div key={i} style={{ display: i === activeIndex ? 'block' : 'none' }}>
+   <Activity key={i} mode={i === activeIndex ? 'visible' : 'hidden'}>
      {panel}
-   </div>
+   </Activity>
  ))}
```

### MapInvalidator — update observation target

`MapInvalidator` currently walks up ancestor elements watching for `style` attribute changes, which works because the current `<div style={{ display: 'none' }}>` wrapper sits 2–3 levels above the `MapContainer` and is within the observer's walk range.

With `<Activity>`, React does not set a style on any wrapper element. Instead it applies `display: none !important` directly on each host DOM instance inside the `<Activity>` tree — including the `MapContainer` div itself. The ancestor walk-up will no longer fire.

**Required change to `MapInvalidator`:** In addition to the existing ancestor observation, also observe the map container element itself:

```ts
// Observe the container directly (for <Activity> which mutates the host node)
observer.observe(container, { attributes: true, attributeFilter: ['style'] })
// Then the existing ancestor walk-up as before
```

This ensures the observer fires regardless of whether the style change originates on the container or an ancestor.

---

## Files Changed

| File | Change |
|------|--------|
| `lib/overpassRailService.ts` | Add `[!"service"]` filter; check override map in `fetchMultiSegmentRailRoute` |
| `lib/heroRouteData.ts` | Add `RAIL_SEGMENT_OVERRIDES` export |
| `scripts/prefetch-routes.ts` | New: one-off script to fetch and save OSRM routes |
| `lib/staticRoutes.json` | New: generated — committed to repo |
| `lib/staticRoutes.ts` | New: typed re-export of JSON |
| `app/page.tsx` | Remove OSRM fetch calls; import from `lib/staticRoutes.ts` |
| `components/phases/PhaseNav.tsx` | Replace `display:none/block` divs with `<Activity>` |
| `components/map/MapInvalidator.tsx` | Also observe `map.getContainer()` directly (not just ancestors) |

---

## Non-goals

- Removing Overpass calls entirely — kept live for real rail geometry
- Replacing `MapInvalidator` — kept as-is
- Pre-baking GPX hiking routes — already local `fs`, no HTTP dependency
- Enabling `cacheComponents` (PPR) — out of scope, page is already fully static SSG
