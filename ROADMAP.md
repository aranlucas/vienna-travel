# Feature roadmap

Planning baseline: `8fa21f917a50` on `origin/main`, 2026-10-26. Proposed work extends this curated Austria itinerary, not a general booking platform.

## Outcome

Help a traveler answer what happens next and keep a usable plan when connectivity is poor. The [current application](README.md) already has regional maps, a timeline, hike/GPX details, packing and logistics views, weather, and read-only WebMCP tools.

## 1. Take the next day's plan along

Offer a compact, explicitly dated offline or printable day packet assembled from the existing trip data. Include selected activities, transport, stays and relevant notes with clear confirmation states.

Acceptance:

- The packet and on-screen day view agree on dates, order and location references.
- It can be read without live maps or weather requests.
- Saved weather includes its retrieval time and is never labelled live.
- Export excludes private identifiers and does not add unapproved personal information.
- Missing or unconfirmed logistics stay visible rather than being filled in by inference.

Try the packet during one low-connectivity outing. Record which information was missing and how often a traveler still needed to reopen another source.

## 2. Make changed plans understandable

Show a review of itinerary changes before replacing a saved packet: moved activities, changed accommodation and outdated transport assumptions. Keep source data in the existing modules under `lib/data/`.

Acceptance: bookings continue to derive from the stay confirmation field, and the timeline continues to derive from canonical transport, stays and activities.

## 3. Share the same answer with assistants

Extend the existing read-only WebMCP surface only for proven day-plan questions. Return the same data, confirmation states and freshness labels as the interface.

Acceptance: an assistant can identify the selected day and uncertainty without gaining booking or mutation authority.

## Boundaries and evidence

Keep current itinerary ownership here; trvl owns general travel discovery. No automatic reservations, copied private travel documents or new write-capable agent tools are needed. GPX files and summaries do not guarantee route safety or current access.

Measure whether travelers can locate the next practical action and recover their plan offline. More itinerary content or assistant tools alone is not evidence of better travel.
