import { expect, it } from "vitest";
import { formatDuration } from "@/lib/units";

it.each([
  [0.5, "30min"],
  [2, "2h"],
  [2.5, "2h 30min"],
  [1.999, "2h"],
] as const)("formats %s hours without a 60-minute overflow", (hours, expected) => {
  expect(formatDuration(hours)).toBe(expected);
});
