# Austria Expedition

A public travel companion for the September 5–14, 2026 Austria itinerary: regional maps, daily plans, transport and stays, hike details, packing, weather, and read-only WebMCP access.

[Explore the trip](https://vienna-travel.vercel.app) · [Timeline](https://vienna-travel.vercel.app/timeline) · [Packing](https://vienna-travel.vercel.app/packing)

![Illustrated journey from Vienna through the Austrian lakes and Alps](docs/images/austria-expedition-cover.png)

## Run locally

Use the Node.js version in [`.node-version`](.node-version) and the pnpm version pinned by `packageManager` in [`package.json`](package.json).

```bash
git clone https://github.com/aranlucas/vienna-travel.git
cd vienna-travel
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL printed by Portless (normally `https://vienna-travel.localhost`; worktrees can get a branch-specific hostname). On first run it may request `sudo` to bind port 443 and trust a local certificate. Maps need no environment variables; `NEXT_PUBLIC_CARTO_BASEMAP_KEY` optionally adds a key to the CARTO tile requests.

## Adapt the itinerary

Edit the source records in [`lib/data/`](lib/data/), following the [public-data privacy boundary](lib/data/README.md) and [data conventions](AGENTS.md#trip-data). Keep traveler-specific confirmations in an encrypted private system.

Road and rail geometry are checked in so rendering does not depend on routing services. After changing driving waypoints, train waypoints or train relation IDs, refresh [`lib/staticRoutes.json`](lib/staticRoutes.json) from the repository root. This maintenance command requires a separately provisioned `tsx` runner on PATH; it is not a project dependency:

```bash
tsx scripts/prefetch-routes.ts
```

Use `tsx scripts/prefetch-routes.ts --train-only` only when driving data is unchanged. The script contacts OSRM and the OpenStreetMap API and writes the JSON only after all requested geometry succeeds. Review the route changes before committing; the [route contract test](test/routes.test.ts) checks that cached geometry matches the canonical waypoints.

Keep the distinction between verified and reference GPX files: the Seebensee download starts in the valley and does not match the planned gondola-start hike. Reference tracks must remain download-only; they must not replace the itinerary's map or statistics.

Weather loads in the browser through `/api/weather`; failed refreshes retain the last forecast with a stale label or seasonal guidance. A forecast or GPX track does not establish current trail access, lift operation or safe alpine conditions. Confirm conditions and reservations with their providers.

See the [roadmap](ROADMAP.md) for proposed product work and [security policy](SECURITY.md) for private reporting and exposure recovery.

## Checks

The available checks are defined in [`package.json`](package.json):

```bash
pnpm check:privacy
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test:run
pnpm build
```

Fixed-pixel design tokens intentionally keep controls and maps the same size at the 16px mobile and 19px desktop root font sizes.
