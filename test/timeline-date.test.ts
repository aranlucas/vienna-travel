import { expect, it } from "vitest";
import { buildTimelineEvents } from "@/lib/timeline-events";

it("labels September 8 by its calendar date even on UTC+14 hosts", () => {
  const previous = process.env.TZ;
  process.env.TZ = "Pacific/Kiritimati";
  try {
    const ascent = buildTimelineEvents().find(({ id }) => id === "train-schafberg-ascent");
    expect(ascent?.dateLabel).toBe("Tuesday, Sep 08");
  } finally {
    if (previous === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = previous;
    }
  }
});

it("keeps checkout deadlines until the end of a hotel window", () => {
  const events = buildTimelineEvents();
  for (const id of ["checkout-zimmerbraeu", "checkout-ehrwald", "checkout-innsbruck"]) {
    expect(events.find((event) => event.id === id)?.sortTime).toBe(660);
  }
  expect(events.find(({ id }) => id === "checkin-zimmerbraeu")?.sortTime).toBe(900);
});
