# Untangle decision log — 2026-11-06

## Scope and baseline

Whole repository reviewed: app routes/styles, map/hike/transport/timeline/planning/weather/WebMCP components, canonical data and compatibility exports, route/GPX/weather services, maintenance script, tests, documentation and CI/configuration. Started at 28af1bb with a clean tree. Preserve prior test pruning (#62), documentation consolidation (#63), public-data privacy policy and both compatibility entrypoints. Both optional additions selected. Tests/builds run only in CI; no local baseline execution or claims of passing tests. No owned local test processes were started.

## Inventory and design (recorded before implementation)

1. Give checklist records explicit stable identity and departure-eve metadata; own persistence in the checklist feature.
   - `pre-departure-checklist.tsx` matches six text prefixes from logistics fixtures. Editing copy silently changes filtering.
   - Stored numeric indices silently move completion to another task when records reorder.
   - Reads can throw when storage is denied; swallowed writes claim a session fallback which does not exist.
   - Existing persistence test asserts serialized storage internals instead of checked behavior.
   - Keep legacy indices as explicit migration metadata, never infer legacy order from current rendering order. Continue reading v1 once when v2 is absent. Preserve the existing six departure-eve selections.
2. Share transport duration formatting and Leaflet defaults where a single change currently requires two edits.
   - TrainStats/DrivingStats duplicate duration formatting, including the 60-minute rounding overflow.
   - HeroMap/PhaseMap duplicate a global Leaflet prototype mutation and asset URL configuration. Replace default icon mutation with one explicit bundled icon passed at markers; custom icons already exist on every marker, so the unused setup can simply go.
3. Depend on canonical route records, not assembled presentation phases, and derive route group validation from phase definitions.
   - hero-route-data imports the full assembly just to get trains.
   - StaticRoutes and its schema separately enumerate four phases; adding a phase requires changes outside canonical definitions.
   - Preserve cache freshness assertions and prefetch behavior; the maintenance script remains repository-specific domain glue.
4. Make weather eligibility have one owner.
   - resolveDaysWeather repeats the snapshot module's forecast-window rule for request selection and output generation.
   - Keep bounded retries, request cancellation, partial forecast preservation and explicit scope identity: these satisfy real external-service constraints.
5. Remove restating comments in touched modules; retain external contracts, privacy/safety notes, directive comments and GPX reference-track rationale.

6. Keep route provenance with cached geometry on train-only refresh; previously the command stamped old driving coordinates with new waypoint keys. Add regression coverage at the cache assembly boundary.
7. Share the provider's ticking Vienna clock for next-event selection; TravelTimeline captured time once while FlyTonightCard maintained a separate interval. Keep jump inputs user-editable and hydration deterministic. Remove unused PhasePanel children override and DayEntry index prop.

8. Review follow-ups: weather-unit persistence also needs a session fallback when storage is denied; map colors need one owner; Leaflet invalidation should observe container resizing instead of assuming 50ms is enough. Consolidate event presentation metadata into one exhaustive catalog. Keep the CLI entrypoint unconditional and move importable route refresh into a domain module with injectable routing services for CI coverage (no module mocking).

## Retained boundaries and special cases

- Keep tripData/confirmedStays imports as required compatibility contracts.
- GPX reference tracks remain download-only; failed/missing track reads retain planned statistics.
- Weather retries/timeouts, stale retention and Vienna time-zone behavior are domain requirements, not speculative wrappers.
- Keep read-only WebMCP hooks, installer bootstrap/SSR tests, privacy checks and route consistency tests. UI icon variants and event-type presentation branches reflect distinct behavior.
- No broad folder moves, speculative dependencies or replacement of working maps/charts/validation libraries. Existing Leaflet and Zod cover this change; duration formatting is small domain display logic, not a date library replacement.

## Validation and review

Pending implementation and sequential independent review. Existing CI already covers privacy, lint, formatting, types, complete Vitest suite and build; make test execution explicitly one-shot and name the step accurately. CI is the only execution evidence for behavior.

### Review rounds and validation evidence

- Round 1 inventoried checklist identity/storage, cache provenance, phase ownership, stale timeline clock, repeated presentation metadata, unused props/map defaults and implementation-bound assertions.
- Round 2 caught a detached DOM assertion and an unsafe CLI import guard; fixed both, extracted injectable route refresh, added explicit behavioral cases. Also addressed weather storage, shared map color and container resize signaling.
- Retained the existing meaningful tests; rewrote the checklist test to observe live checked state. Added regression cases for migration/reorder, denied storage, metadata filtering, duration overflow, scheduled transport consolidation and ticking next-event selection. Expected values follow published fixture times or independent small examples.
- Dependencies installed with lifecycle scripts disabled. Read the installed Next.js Vitest and Route Handler guides. Local formatting and static lint only; tests/build/typecheck remain CI-owned. No local behavioral test or build was executed.
- Round 3 confirmed all 28 legacy checklist positions and six departure-eve selections, shared clock behavior and unconditional CLI boundary. Removed the final empty-else artifact. Reviewer found no further worthwhile issues. Static lint passed after fixes; CI results are pending.
