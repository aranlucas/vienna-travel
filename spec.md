# Austria Itinerary Demo — Product Spec

Repo: `vienna-travel`
Stack: Next.js 16.3.2 (App Router) · TypeScript · Tailwind v4 · Leaflet + react-leaflet · Recharts

All trip details in this document and the tracked data modules are fictional public-demo fixtures.

---

## Product Summary

This app demonstrates a trip-planning site using a fictional 10-day Austria itinerary:

- `Sept 5–14, 2037`
- `2 sample travelers`
- `ORIGIN → VIE → Vienna → Salzburg/lakes → Tyrol → Innsbruck → Vienna Airport`

It combines:

- itinerary structure by phase and by day
- maps for driving, hiking, and city walks
- hotel / POI / booking context
- date-specific deadlines and live trip checks
- weather in each daily view
- GPX-backed hiking data with downloads
- packing and pre-departure planning

User-facing trail and route distances now render in `miles / feet`. Internal source data remains metric where convenient for APIs and GPX parsing.

---

## Trip Content

### Phase 1 — Vienna

- Hotel: `Vienna City Hotel`
- Day 1 focuses on arrival logistics plus the historic center
- Day 2 is a mixed `transit + walk` day, not one continuous walking route
- Map includes two separate walking overlays
- Vienna POIs include stronger central-city coverage: `Stadtpark`, `Karlskirche`, `Stephansdom`, `Opera`, `Albertina`, `Burggarten`, `Hofburg`, `Schönbrunn`, `Grinzing`
- Vienna also has a curated `Suggested Stops` panel with direct Google Maps links

### Phase 2 — Salzkammergut

- Train from Vienna to Salzburg, then rental car loop
- Confirmed stay: `Lakeside Guesthouse`, `St. Wolfgang`
- Hallstatt + Schafberg day remains the main itinerary uncertainty because Skywalk / Salzberg access may change by season
- Current plan treats Schafberg and Hallstatt as separate highlights rather than one tightly timed urban walk
- Phase now has a curated `Suggested Stops` panel with direct Google Maps links

### Phase 3 — Tyrol

- Base: `Tyrol Mountain Hotel`, `Ehrwald`
- Includes `Highline 179`, `Plansee`, `Seebensee & Drachensee`, `3-Lake Loop`, `Zugspitze`
- Hike cards are backed by real GPX files, not placeholder routes
- Phase now has a curated `Suggested Stops` panel with direct Google Maps links

### Phase 4 — Olpererhütte & Return

- Includes `Schlegeis Reservoir`, `Trail 502`, `Olpererhütte`, `Innsbruck Old Town`, and return train to `Vienna Airport`
- Day 8 is still the tightest logistics day in the itinerary and should be treated as an early-start day
- Phase now has a curated `Suggested Stops` panel with direct Google Maps links

---

## Current Features

### Maps

- Hero map shows the overall road and rail journey
- `Full Route Overview` also shows:
  - confirmed-stay cards
  - a flight card
  - Google Maps links for the annotated stays and Vienna Airport
- Phase maps show:
  - driving routes
  - hiking routes
  - day-specific city walking overlays where applicable
  - POI markers by type
  - hike start markers
- POI popups include `Open in Google Maps`
- Some major POIs use static Google place URLs; others fall back to coordinate-based Google Maps links

### Daily Timeline

- Each day supports:
  - title
  - activities
  - `Important` / `Fun` highlights
  - accommodation
  - notes
  - weather block
  - `What to Carry Today` callouts
- Weather block behavior:
  - uses forecast when the trip date is inside the forecast window
  - otherwise falls back to historical climate guidance
  - uses the itinerary's explicit summit or hut elevation for exposed alpine days
  - can aggregate hourly temperature, feels-like, rain, and gust signals across a planned activity window
  - shows the forecast lead time so early outlooks are clearly distinguished from short-range decisions

### Hikes / GPX

- Real GPX files live in `public/gpx`
- Server-side GPX parsing computes:
  - route coordinates
  - total distance
  - elevation gain
  - sampled elevation profile
- Hike cards show:
  - difficulty
  - miles
  - feet of gain
  - elevation chart
  - `GPX Verified` badge
  - `Download GPX` link

### Planning Utilities

- Booking status section
- `Deadlines & Live Checks` timeline with absolute dates
- Pre-departure checklist
- Eco Light packing section
- per-day `What to Carry Today` planning chips in the itinerary timeline
- `Suggested Stops` panels for Vienna, Salzkammergut, Tyrol, and Innsbruck / Olperer phase
- Flight card with seat-side note
- Train segments with seat-side notes where useful

### Layout / Spacing

- Hero is now intentionally tighter than the earlier version:
  - no duplicated flight / Vienna hotel cards at the top
  - reduced bottom padding below the title/date block
  - phase pills sit closer to the `Full Route Overview` section
- The denser layout is intentional because the route overview now carries the main trip-summary cards

---

## Architecture

### Rendering Model

`app/page.tsx` is an async server component. It assembles the page server-side and passes prebuilt panel content into the tab UI.

Current server work includes:

1. hero driving route from static route data
2. hero train geometry from Overpass relation geometry when available, with waypoint fallback
3. per-phase static driving routes
4. per-phase GPX parsing for hikes
5. per-day weather resolution via Open-Meteo, including feels-like temperature, precipitation,
   wind/gusts, UV, local daylight, and planned alpine-window exposure with historical fallback logic

Important implication:

- the page still has live network dependencies at render/build time
- hero rail geometry and forecast weather are the main dynamic inputs

### Component Shape

```text
app/page.tsx (async server)
├── TripWebMcp (headless client tool provider)
├── HeroSection
├── HeroMap via MapLoader
├── TripWeatherOutlook
├── PhaseNav
│   ├── PhaseVienna
│   ├── PhaseSalzkammergut
│   ├── PhaseTyrol
│   └── PhaseOlperer
├── Booking Status
├── Deadlines & Live Checks
├── PackingSection
└── Pre-Departure Checklist
```

### Data Flow

- `lib/tripData.ts` is the canonical itinerary and content source
- `lib/confirmedStays.ts` is the shared source for confirmed hotel metadata used by the route overview and booking-related surfaces
- `STATIC_ROUTES` provides pre-baked driving geometry
- `lib/gpxServer.ts` parses local GPX files on the server
- `lib/weatherService.ts` upgrades a day from historical weather to a detailed daily forecast when possible, using
  explicit high-elevation points and bounded hourly windows for exposed activities
- `components/webmcp/TripWebMcp.tsx` exposes read-only trip overview, day-plan, weather, and
  plan-search tools from the same enriched data rendered by the page
- booking references, passenger details, and property contact details are intentionally kept out
  of the tracked public data; private confirmations should remain in a local ignored overlay
- phase-level suggested stops, live checks, and carry-day callouts are defined in `tripData.ts`
- phase maps and cards receive already-enriched data from `app/page.tsx`

---

## Key Files

| File                                            | Purpose                                                                                                                 |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `app/page.tsx`                                  | Server assembly of hero routes, phase routes, GPX enrichment, and weather enrichment                                    |
| `lib/confirmedStays.ts`                         | Confirmed hotel metadata and checklist-fit note used by the overview UI                                                 |
| `lib/tripData.ts`                               | All trip content: phases, POIs, hikes, bookings, packing, checklist, weather fallbacks                                  |
| `lib/gpxServer.ts`                              | Server-side GPX parser that computes coords, distance, gain, and chart data                                             |
| `lib/weatherService.ts`                         | Forecast-when-available weather resolver using Open-Meteo, with bounded retries and alpine-window aggregation           |
| `components/weather/TripWeatherOutlook.tsx`     | Detailed daily forecast cards with shared metric/imperial preference, forecast horizon labels, and historical fallbacks |
| `components/webmcp/TripWebMcp.tsx`              | Strict WebMCP tool registration for read-only access to the existing trip plans                                         |
| `lib/mapLinks.ts`                               | Google Maps URL builder with canonical-place override support                                                           |
| `lib/units.ts`                                  | Presentation-layer unit conversion helpers (`mi`, `ft`)                                                                 |
| `components/map/PhaseMap.tsx`                   | Phase map rendering: POIs, drives, hikes, day routes, Google Maps links                                                 |
| `components/hike/HikeCard.tsx`                  | Hike summary card with GPX download link                                                                                |
| `components/hike/ElevationChart.tsx`            | Elevation chart with imperial display formatting                                                                        |
| `components/timeline/DayTimeline.tsx`           | Daily itinerary cards with highlights, weather, and `What to Carry Today` callouts                                      |
| `components/planning/TripChecksTimeline.tsx`    | Deadline and live-check cards with absolute dates                                                                       |
| `components/planning/SuggestedStopsSection.tsx` | Reusable curated POI grid with Google Maps links                                                                        |
| `components/packing/PackingSection.tsx`         | Eco Light packing plan UI                                                                                               |
| `components/phases/PhaseVienna.tsx`             | Vienna panel wiring map, timeline, and suggested stops                                                                  |

---

## External Data Sources

### Routing / Maps

- `OSRM` for road-following routes
- `Overpass` for rail relation geometry
- `Leaflet` + Carto dark tiles for map rendering

### Weather

- `Open-Meteo` forecast API for near-term live weather
- historical climate text is stored in `tripData.ts` as fallback content

### Agent access

- W3C WebMCP imperative tools via `document.modelContext`
- `usewebmcp` for React lifecycle ownership and the strict WebMCP polyfill

### Hiking

- local GPX files in `public/gpx`
- current GPX-backed hikes:
  - `seebensee-drachensee.gpx`
  - `three-lakes-loop.gpx`
  - `olpererhuette-trail502.gpx`

---

## Current Product Decisions

### Units

- trail and route surfaces use `miles / feet`
- temperatures remain in `°C / °F` narrative form where that reads better for travel planning
- metric source data is kept internally for routing and parsing simplicity

### Weather UX

- do not block the page on long weather requests
- if forecast is unavailable or out of range, keep historical guidance instead of showing an error state

### Privacy Boundary

- never commit booking confirmation codes, passenger ticket numbers, names, phone numbers, or private
  property contact details
- the WebMCP tools expose only the sanitized itinerary data rendered by the page
- keep any traveler-specific confirmation notes in an ignored local file or password manager

### Google Maps Links

- prefer explicit `googleMapsUrl` when available
- otherwise generate coordinate-based Google Maps search links
- do not attempt to synthesize brittle place URLs from names alone

### GPX Strategy

- trust local downloaded GPX files over hand-entered hike stats
- enrich hikes from GPX on the server
- keep static hike values in `tripData.ts` aligned with those files as a fallback

---

## Known Limitations

- `app/page.tsx` still relies on live external services during render/build for some data
- Overpass hero train geometry can still be a source of slow builds or incomplete rail routes
- weather remains a forecast, not a trail report; alpine windows use explicit summit or hut elevations but do not
  model microclimates or guarantee lift, road, or trail conditions
- not every non-Vienna POI has a canonical static Google place URL yet
- live checks and booking deadlines are informational only; there is no reminder engine, persistence layer, or calendar integration
- hero and phase maps still use Leaflet, so tab/panel UIs should prefer mounting only the active map rather than hiding multiple live maps at once

---

## High-Value Next Ideas

### Product / Planning

- add transfer-detail cards for stations, garages, car pickup/return, and airport-hotel walking paths
- add stateful completion tracking for bookings, live checks, and pre-departure items
- add an export or reminder flow for the dated live checks

### Map / POI

- add more static Google place URLs for Hallstatt, Innsbruck, and Tyrol highlights
- optionally add one-click directions links, not just place/search links

### Weather / Units

- consider adding hourly windows for the highest-risk hike and summit days
- consider a dedicated alpine source for trailhead, hut, and summit conditions

### Reliability

- pre-bake hero train geometry so the home page no longer depends on Overpass
- optionally cache forecast responses or isolate weather from build-sensitive paths

---

## Pre-Departure Priority Items

- verify the lakes hotel near `St. Wolfgang`
- verify the rental car `Salzburg Hbf → Innsbruck Hbf`
- verify the Tyrol hotel near `Ehrwald`
- verify the Innsbruck hotel near `Hbf`
- verify the airport hotel
- verify the `Schafbergbahn` slot
- verify the `ÖBB` seat reservation for the Sunday Railjet
- recheck Hallstatt Skywalk / Salzberg access close to departure
- confirm GPX files are loaded to phones for offline use

---

## Validation Notes

When changing the app, the normal verification path is:

```bash
npm run lint
npx tsc --noEmit
```

`pnpm build` may still be sensitive to live route/weather fetches. The current resolver bounds each weather request and
uses historical guidance when the upstream forecast is unavailable; route data remains pre-baked for repeatable builds.
