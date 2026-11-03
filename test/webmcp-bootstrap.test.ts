// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal("isSecureContext", true);
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("Unexpected network request");
    }),
  );
});

afterEach(() => {
  Reflect.deleteProperty(Document.prototype, "modelContext");
  Reflect.deleteProperty(globalThis, "ModelContext");
  vi.unstubAllGlobals();
});

it("installs the real 6.x context on a fresh component import before any hook runs", async () => {
  // No preinstalled context: only the production import can install the real runtime.
  expect("modelContext" in document).toBe(false);
  const { TripWebMcp } = await import("@/components/webmcp/trip-web-mcp");

  expect(TripWebMcp).toBeTypeOf("function");
  expect(Object.getOwnPropertyDescriptor(Document.prototype, "modelContext")).toHaveProperty(
    "get",
    expect.any(Function),
  );
  expect(document.modelContext).toBeInstanceOf(globalThis.ModelContext);
  expect(document.modelContext).toHaveProperty("registerTool", expect.any(Function));
  expect(document.modelContext).toHaveProperty("getTools", expect.any(Function));
  expect(document.modelContext).toHaveProperty("executeTool", expect.any(Function));
  expect(fetch).not.toHaveBeenCalled();
});
