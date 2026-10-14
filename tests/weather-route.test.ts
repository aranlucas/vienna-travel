import { afterEach, expect, it, vi } from "vitest";

import type { DayPlan } from "../lib/tripData";
import { createWeatherHandler } from "../lib/weather-route";
import { resolveDaysWeather } from "../lib/weather-service";

const syntheticDay: DayPlan = {
  isoDate: "2026-10-02",
  date: "Test day",
  dayLabel: "Test",
  title: "Private static title",
  phaseId: "test",
  activities: [],
  weatherLocation: { name: "Synthetic point", coordinates: { lat: 1, lng: 2 } },
};

const GET = createWeatherHandler(() => resolveDaysWeather([syntheticDay]));

import { isWeatherSnapshot } from "../lib/weather-snapshot";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it("returns the weather-only contract on success", async () => {
  vi.useFakeTimers({ now: new Date("2026-10-02T08:00:00Z") });
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      Response.json({
        daily: { time: ["2026-10-02"], temperature_2m_max: [22], temperature_2m_min: [12] },
      }),
    ),
  );
  const response = await GET();
  const payload: unknown = await response.json();
  expect(response.status).toBe(200);
  expect(response.headers.get("Cache-Control")).toBe("no-store, max-age=0");
  expect(isWeatherSnapshot(payload)).toBe(true);

  if (!isWeatherSnapshot(payload)) {
    throw new Error("Expected a validated weather snapshot");
  }

  expect(payload.days[0].status).toBe("forecast");
  expect(JSON.stringify(payload)).not.toContain("Private static title");
  expect(payload).not.toHaveProperty("refreshedAt");
});

it("reports provider outages explicitly instead of stamping fallback guidance as a successful forecast", async () => {
  vi.useFakeTimers({ now: new Date("2026-10-02T08:00:00Z") });
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Synthetic outage")));
  const pending = GET();
  await vi.runAllTimersAsync();
  const payload: unknown = await (await pending).json();
  expect(isWeatherSnapshot(payload)).toBe(true);

  if (!isWeatherSnapshot(payload)) {
    throw new Error("Expected a validated weather snapshot");
  }

  expect(payload.days[0].status).toBe("unavailable");
  expect(payload.days[0]).not.toHaveProperty("fetchedAt");
  expect(payload.days[0]).not.toHaveProperty("values");
});
