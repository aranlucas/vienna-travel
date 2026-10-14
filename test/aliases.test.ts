import { expect, test } from "vitest";
import { weatherScope } from "@/lib/weather-snapshot";
import { weatherDay } from "@test/helpers/weather-day";

test("resolves source and test-helper aliases", () => {
  expect(weatherScope(weatherDay)).toBe('["Synthetic point",1,2,null,null]');
});
