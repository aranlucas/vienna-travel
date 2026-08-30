<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Data architecture

All trip data lives in `lib/data/`. Never edit the legacy monolith location.

```
lib/
  data/
    trip.ts          # Coordinates type + TRIP_META (title, dates, travelers)
    stays.ts         # All accommodations — STAYS[], CONFIRMED_STAYS, STAYS_BY_ID
                     #   confirmed: boolean drives BOOKINGS.booked
    transport.ts     # FLIGHT_SEGMENTS, LAYOVERS, DRIVING_SEGMENTS, TRAIN_SEGMENTS
                     #   each segment has phaseId
    itinerary.ts     # DAYS: Record<isoDate, DayPlan>
                     #   DayActivity has { time?, title } — no time embedded in text
                     #   DayPlan has phaseId
    phases.ts        # PHASE_DEFINITIONS — thin: map config + suggestedStopIds only
    hikes.ts         # HIKES: Record<string, Hike & { phaseId }>
    pois.ts          # POIS: Record<string, PointOfInterest & { phaseId }>
    packing.ts       # PACKING_PLAN
    logistics.ts     # BOOKINGS (booked derives from stay.confirmed)
                     #   CHECKLIST, LIVE_CHECKS, PLANNING_SHORTLIST
  tripData.ts        # Assembly layer — builds fat PHASES for backward compat
                     #   Re-exports all types; do not add raw data here
  confirmedStays.ts  # Re-export shim → lib/data/stays.ts
  timelineEvents.ts  # Pure derivation from transport + stays + itinerary; no hardcoding
```

## Key conventions

- **Activity time**: store as `{ time: '8:30 AM', title: 'Take the gondola' }` — never `text: '8:30 AM — Take the gondola'`
- **Phase membership**: set `phaseId` on each day/POI/hike/segment — never nest flat data inside a phase object
- **Bookings**: set `confirmed: true` on the Stay; BOOKINGS derives `booked` automatically — never manually mirror
- **Timeline events**: flights come from FLIGHT_SEGMENTS, hotels from STAYS, activities from DayActivity.time — never hardcode events in timelineEvents.ts
- **Backward compat**: all component imports from `@/lib/tripData` and `@/lib/confirmedStays` remain valid
