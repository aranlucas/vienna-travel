type WebMCPInitializers = {
  installWebMCP?: () => void;
  initializeWebMCPPolyfill?: () => void;
};

export function initializeWebMCP(initializers: WebMCPInitializers): void {
  if (typeof document === "undefined") {
    return;
  }

  // Support both the 5.x and 6.x polyfill APIs without importing a missing export.
  const initialize = initializers.installWebMCP ?? initializers.initializeWebMCPPolyfill;

  if (!initialize) {
    throw new Error("WebMCP initializer unavailable");
  }

  initialize();
}
