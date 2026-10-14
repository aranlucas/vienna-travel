import { expect, it } from "vitest";
import { buildTimelineEvents } from "../lib/timeline-events";

it("returns all timeline events in chronological order", () => {
  const events = buildTimelineEvents();
  expect(events.length).toBeGreaterThan(0);
  expect(events).toEqual(
    events.toSorted((left, right) => {
      const dates = left.date.localeCompare(right.date);

      return dates === 0 ? left.sortTime - right.sortTime : dates;
    }),
  );
});

it("repeated derivation preserves event identities and content", () => {
  const first = buildTimelineEvents();
  const second = buildTimelineEvents();
  expect(second).toEqual(first);
  expect(new Set(first.map((event) => event.id)).size).toBe(first.length);
});

it("uses stable, unique content keys for itinerary activity and source lists", () => {
  const events = buildTimelineEvents();

  const sourceKeys = events.map((event) =>
    (event.links ?? []).map((link) => `${link.href}-${link.label}`),
  );

  expect(sourceKeys.every((keys) => new Set(keys).size === keys.length)).toBe(true);
});
