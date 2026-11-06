// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createChecklistStore } from "@/components/planning/checklist-store";

const jacket = { id: "jacket", legacyIndex: 0, item: "Pack a jacket", critical: false };
const passport = { id: "passport", legacyIndex: 1, item: "Passport", critical: true };

beforeEach(() => window.localStorage.clear());

afterEach(() => vi.restoreAllMocks());

it("preserves legacy checks by original identity after reordering", () => {
  window.localStorage.setItem("predeparture-checklist-v1", '{"0":true}');
  const store = createChecklistStore();
  const items = [passport, jacket];
  expect(store.read(store.getSnapshot(), items)).toEqual({ jacket: true, passport: false });
  store.write({ jacket: true, passport: true });
  const remounted = createChecklistStore();
  expect(remounted.read(remounted.getSnapshot(), [jacket, passport])).toEqual({
    jacket: true,
    passport: true,
  });
});

it("keeps checks for this session when browser storage denies reads and writes", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("denied");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("denied");
  });
  const store = createChecklistStore();
  expect(store.read(store.getSnapshot(), [jacket])).toEqual({ jacket: false });
  store.write({ jacket: true });
  expect(store.read(store.getSnapshot(), [jacket])).toEqual({ jacket: true });
});

it("ignores malformed stored completion state", () => {
  const store = createChecklistStore();
  expect(store.read('{"jacket":"yes"}', [jacket])).toEqual({});
});
