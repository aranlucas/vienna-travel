// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  TripProgressProvider,
  TripProgressControl,
  ThroughDate,
} from "../components/planning/trip-progress";
import { PreDepartureChecklist } from "../components/planning/pre-departure-checklist";
import { PhaseNav } from "../components/phases/phase-nav";
import { TRIP_DATA } from "../lib/tripData";

beforeEach(() => {
  window.localStorage.clear();
  vi.useFakeTimers({ now: new Date("2026-09-10T08:00:00Z") });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("keeps past dated content recoverable through repeated show/hide actions", () => {
  render(
    <TripProgressProvider>
      <TripProgressControl />
      <ThroughDate date="2026-09-09">
        <p>Past itinerary</p>
      </ThroughDate>
      <ThroughDate date="2026-09-10">
        <p>Current itinerary</p>
      </ThroughDate>
    </TripProgressProvider>,
  );
  expect(screen.queryByText("Past itinerary")).toBeNull();
  expect(screen.getByText("Current itinerary")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Show past days" }));
  expect(screen.getByText("Past itinerary")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Hide past days" }));
  expect(screen.queryByText("Past itinerary")).toBeNull();
  expect(screen.getByText("Current itinerary")).toBeTruthy();
});

it("returns from a hidden past phase to today's phase and tolerates repeated tab clicks", () => {
  render(
    <TripProgressProvider>
      <TripProgressControl />
      <PhaseNav
        panels={TRIP_DATA.phases.map((phase) => (
          <p key={phase.id}>{phase.id} panel</p>
        ))}
      />
    </TripProgressProvider>,
  );

  const current = TRIP_DATA.phases.find((phase) =>
    phase.days.some((day) => day.isoDate === "2026-09-10"),
  );

  if (!current) {
    throw new Error("The trip fixture must contain September 10");
  }

  expect(screen.getByText(`${current.id} panel`)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Show past days" }));
  const first = screen.getAllByRole("tab")[0];
  fireEvent.click(first);
  fireEvent.click(first);
  expect(first.getAttribute("aria-selected")).toBe("true");
  expect(screen.getByText(`${TRIP_DATA.phases[0].id} panel`)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Hide past days" }));
  expect(screen.getByText(`${current.id} panel`)).toBeTruthy();
  expect(screen.getByRole("tab", { selected: true }).textContent).toContain(current.title);
});

it("keeps fresh checklist inputs controlled and restores checked state after remount", () => {
  const items = [{ item: "Pack a jacket", critical: false }];
  const mounted = render(<PreDepartureChecklist items={items} />);
  const checkbox = screen.getByRole("checkbox");
  expect(checkbox.getAttribute("checked")).toBeNull();
  fireEvent.click(checkbox);
  expect(window.localStorage.getItem("predeparture-checklist-v1")).toBe('{"0":true}');
  mounted.unmount();
  render(<PreDepartureChecklist items={items} />);
  expect(screen.getByRole("checkbox").getAttribute("checked")).toBe("");
  fireEvent.click(screen.getByRole("checkbox"));
  expect(window.localStorage.getItem("predeparture-checklist-v1")).toBe('{"0":false}');
});
