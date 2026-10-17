import { expect, it, vi } from "vitest";
import { initializeWebMCP } from "@/components/webmcp/initialize-webmcp";

it.each([true, false])(
  "does not initialize during SSR (initializer present: %s)",
  async (present) => {
    const initialize = vi.fn(() => {
      throw new Error("Browser initializer called on server");
    });

    expect("document" in globalThis).toBe(false);
    initializeWebMCP(
      present ? { installWebMCP: initialize, initializeWebMCPPolyfill: initialize } : {},
    );
    await expect(import("@/components/webmcp/trip-web-mcp")).resolves.toHaveProperty("TripWebMcp");
    expect(initialize).not.toHaveBeenCalled();
  },
);
