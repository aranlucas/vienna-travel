import { expect, it, vi } from "vitest";

it("imports the component with the real native installer during SSR", async () => {
  vi.resetModules();
  expect("document" in globalThis).toBe(false);
  await expect(import("@/components/webmcp/trip-web-mcp")).resolves.toHaveProperty("TripWebMcp");
  expect("document" in globalThis).toBe(false);
});
