# Reliability audit — 2026-11-06

Baseline: remote default `5f6845f` (merged untangle pass). Clean isolated worktree.
Tests and builds run in CI only; local work is source inspection and dependency installation with scripts disabled.

## Inventory and boundaries

- Next App Router public itinerary (`app/page.tsx`, `/timeline`), phase tabs, booking/stay summaries, hike GPX geometry and elevation, maps, dated planning visibility and checklist.
- Canonical public fixtures in `lib/data/`; assembly/compatibility exports remain public contracts. Privacy policy read; no fixture edits planned.
- Browser persistence: versioned checklist storage, legacy index migration, cross-tab storage notifications and session fallback when storage is denied. No accounts, tenancy, authentication, database transactions or server mutations exist.
- Weather: public read-only `/api/weather`, shared Next cache keyed by itinerary fingerprint, bounded Open-Meteo retries, Zod response validation, client timeout/cancellation, scoped last-good/stale snapshots and refresh deduplication.
- Maps use precomputed validated geometry; optional tile services are external. Maintainer route prefetch reads OSRM/OSM and validates before writing the cache. GPX reads only filenames from trusted checked-in hike fixtures.
- Four read-only WebMCP tools expose overview, day selection, weather and search. User inputs are a trust boundary even though the exposed information is public.
- Existing Vitest contracts cover weather outages, timers, route freshness, privacy, checklist migration, timeline identities and WebMCP lifecycle. Existing CI retains lint, formatting, typecheck, privacy, regressions and build.

## Findings recorded before implementation

1. **Medium, confirmed: calendar labels vary with host timezone.** `lib/timeline-events.ts:formatDateLabel` parses a date at local noon but reads UTC components. Under `Pacific/Auckland` during September (UTC+12), noon is midnight UTC; under `Pacific/Kiritimati` (UTC+14), it is the preceding UTC date. A September 8 event is labeled September 7 on that host. Expected: a date-only itinerary label always denotes its stored calendar date. Fix: parse explicit UTC noon. Regression: fixed known Tuesday September 8, 2026 expectation under UTC+14, including pre-fix CI reproduction.
2. **Medium, confirmed: invalid day requests silently return the first itinerary day.** `components/webmcp/trip-web-mcp.tsx:findDay` normalizes whitespace/punctuation to an empty query; every candidate includes an empty string. `get_day_plan("   ")` and weather selection with punctuation therefore claim success with unrelated data. Expected: existing no-match error. Preserve valid partial title matching and public tool names. Regression: execute both real registered tool callbacks with nonempty inputs normalizing to empty.

3. **Medium, confirmed by independent review:** hotel checkout ranges sort at their opening time although the event says “Checkout by.” Zimmerbräu on September 9 (8–11 AM) sorts at 8 AM and Ehrwald on September 11 (7–11 AM) sorts at 7 AM. This prematurely drops checkout from “Next up” and jump-to-time searches after the window opens. Expected: deadline events sort at the last time in the window; check-in windows keep their opening time. Fix and regression cover both ranges and a single-time checkout.

## Rejected hypotheses and limits

- Weather failures do not overwrite itinerary fields: weather projection and exact location/window scope already protect this contract. A failed refresh retains last-good values and advertises staleness.
- Storage denial is already handled with session fallback; malformed checklist state is rejected with Zod. No proven account isolation defect exists in a public single-itinerary app.
- GPX path traversal is not exposed to requests; filenames come from trusted static fixtures. Do not invent an untrusted upload API.
- Route refresh failures already leave the on-disk cache unchanged; geometry freshness checks intentionally fail builds when canonical waypoints change.
- External tile availability and future provider changes are operational limits, not proven bugs. No structural refactor or unrelated dependency upgrade is planned.

## Validation plan and framework applicability

Use published `e2e` 0.23.0 and `@e2e-dev/web` 0.15.5 (npm metadata verified, Node ^22.22.3 or >=24.8). This is a real browser target; deterministic locator/actions/assertions need no model credentials. Add a production-server CI journey for checklist completion, filtering and persistence across navigation/reload, plus timeline navigation. Retain existing meaningful tests and build gates. Dependency lifecycle scripts are suppressed locally. Independent review will challenge both findings and implementation; CI results will be recorded after execution.
