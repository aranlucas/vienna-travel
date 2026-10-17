// @vitest-environment jsdom
import React, { act } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { DayPlan } from "@/lib/tripData";

type ToolResult = string | number | boolean | null | ToolResult[] | { [key: string]: ToolResult };

type ExecutionOptions = { signal: AbortSignal };

type Tool = {
  name: string;
  execute: (input: Record<string, string>, options: ExecutionOptions) => Promise<ToolResult>;
};

const day: DayPlan = {
  isoDate: "2026-09-10",
  date: "Sept 10",
  dayLabel: "Day 6",
  title: "Synthetic mountain day",
  phaseId: "test",
  activities: [{ time: "8:30 AM", title: "Synthetic hike" }],
  weather: "Seasonal guidance",
};

const trip = {
  title: "Synthetic trip",
  subtitle: "Test",
  dates: "September",
  totalDays: 1,
  travelers: 2,
};

const props = { trip, phases: [], days: [day], bookings: [], liveChecks: [] };

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("Unexpected network request");
    }),
  );
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(document, "modelContext");
  vi.unstubAllGlobals();
});

// The native installer is exercised without a preinstalled context in webmcp-bootstrap.test.ts.
// This context records the real hook's registration signals and callbacks for lifecycle assertions.
it("registers four tools through the real hook and preserves execution, weather updates and abort cleanup", async () => {
  const tools = new Map<string, Tool>();
  const signals: AbortSignal[] = [];

  const registerTool = vi.fn((tool: Tool, options: ExecutionOptions) => {
    tools.set(tool.name, tool);
    signals.push(options.signal);
    options.signal.addEventListener("abort", () => tools.delete(tool.name), { once: true });

    return Promise.resolve();
  });

  Object.defineProperty(document, "modelContext", {
    configurable: true,
    value: { registerTool },
  });
  const { TripWebMcp } = await import("@/components/webmcp/trip-web-mcp");
  const { LiveWeatherContext } = await import("@/components/weather/live-weather-context");
  expect(registerTool).not.toHaveBeenCalled();

  const value = {
    days: [day],
    error: null,
    isLoading: false,
    isRefreshing: false,
    refreshedAt: null,
    refresh: async () => {},
  };

  const view = (days: DayPlan[]) => (
    <LiveWeatherContext value={{ ...value, days }}>
      <TripWebMcp {...props} />
    </LiveWeatherContext>
  );

  const mounted = render(view([day]));
  expect([...tools.keys()].toSorted()).toEqual([
    "get_day_plan",
    "get_trip_overview",
    "get_weather_outlook",
    "search_trip_plan",
  ]);
  expect(registerTool).toHaveBeenCalledTimes(4);

  const execute = async (name: string, input: Record<string, string>) => {
    const tool = tools.get(name);

    if (!tool) {
      throw new Error(`Missing tool: ${name}`);
    }

    let result: unknown;

    await act(async () => {
      result = await tool.execute(input, { signal: new AbortController().signal });
    });

    return JSON.stringify(result);
  };

  expect(await execute("get_trip_overview", {})).toContain("Synthetic trip");
  expect(await execute("get_day_plan", { date_or_day: "Day 6" })).toContain(
    "Synthetic mountain day",
  );
  expect(await execute("search_trip_plan", { query: "hike" })).toContain("Synthetic hike");
  expect(await execute("get_weather_outlook", { date_or_day: "Day 6" })).toContain(
    "Seasonal guidance",
  );
  mounted.rerender(view([{ ...day, weather: "Updated live outlook" }]));
  expect(await execute("get_weather_outlook", { date_or_day: "Day 6" })).toContain(
    "Updated live outlook",
  );
  expect(registerTool).toHaveBeenCalledTimes(4);
  expect(signals.every((signal) => !signal.aborted)).toBe(true);
  mounted.unmount();
  expect(signals).toHaveLength(4);
  expect(signals.every((signal) => signal.aborted)).toBe(true);
  expect(tools.size).toBe(0);
  const remounted = render(view([day]));
  expect(registerTool).toHaveBeenCalledTimes(8);
  expect(tools.size).toBe(4);
  expect(signals.slice(4).every((signal) => !signal.aborted)).toBe(true);
  remounted.unmount();
  expect(signals).toHaveLength(8);
  expect(signals.every((signal) => signal.aborted)).toBe(true);
  expect(tools.size).toBe(0);
});
