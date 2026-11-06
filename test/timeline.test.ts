import { expect, it } from "vitest";
import { buildTimelineEvents } from "@/lib/timeline-events";

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

it("consolidates booked transport into one event at its scheduled time", () => {
  const events = buildTimelineEvents();
  const ascent = events.filter(({ id }) => id === "train-schafberg-ascent");
  expect(ascent).toHaveLength(1);
  expect(ascent[0]).toMatchObject({ type: "train", date: "2026-09-08", sortTime: 555 });

  const returnFlights = events.filter(({ id }) =>
    ["flight-vie-fra", "flight-fra-sea"].includes(id),
  );

  expect(returnFlights.map(({ id }) => id)).toEqual(["flight-vie-fra", "flight-fra-sea"]);
  expect(returnFlights.map(({ sortTime }) => sortTime)).toEqual([480, 645]);
});
