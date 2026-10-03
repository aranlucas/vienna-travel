# Vendored anti-slop

Source: https://github.com/dmmulroy/anti-slop/tree/c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b/skills/install-anti-slop/assets/anti-slop

Exact upstream commit: `c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b`.
Production plugin copied unchanged; root MIT license and nested Stylistic license/provenance preserved. No local source deviations.

All 18 generic rules and native `oxc/no-accumulating-spread` are enabled. Effect rules are not enabled because Effect is not a direct dependency.

Application migration: Zod validates provider weather, snapshot, local-storage, OSRM and static-route tuple boundaries. Route handler tests use an injected resolver instead of module mocks. Pure filter/map chains became flatMap; Leaflet plugin arguments derive from its installed declarations and private icon hook typing matches Leaflet 1.9.4. Known catalog keys use satisfies; dynamic lookup uses Maps. Existing trip literals remain unchanged. No anti-slop exceptions added. The vendored plugin is excluded from application TypeScript and formatting checks; its behavior is smoke-tested separately.
