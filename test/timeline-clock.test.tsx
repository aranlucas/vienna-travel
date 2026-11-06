// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { TravelTimeline } from "@/components/timeline/travel-timeline";
import { TripProgressProvider } from "@/components/planning/trip-progress";
import type { TimelineEvent } from "@/lib/timeline-events";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("advances next-up when Vienna time passes an event", () => {
  vi.useFakeTimers({ now: new Date("2026-09-10T08:00:00Z") });

  const events: TimelineEvent[] = [
    {
      id: "first",
      type: "activity",
      date: "2026-09-10",
      dateLabel: "Thursday",
      sortTime: 600,
      title: "First stop",
      details: [],
    },
    {
      id: "second",
      type: "activity",
      date: "2026-09-10",
      dateLabel: "Thursday",
      sortTime: 660,
      title: "Second stop",
      details: [],
    },
  ];

  render(
    <TripProgressProvider>
      <TravelTimeline events={events} />
    </TripProgressProvider>,
  );
  expect(screen.getByText("Next up").parentElement?.textContent).toContain("First stop");
  act(() => {
    vi.advanceTimersByTime(60_000);
  });
  expect(screen.getByText("Next up").parentElement?.textContent).toContain("Second stop");
});
