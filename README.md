# Austria Itinerary Demo

A public-safe travel-planning demo built with Next.js, TypeScript, Tailwind CSS, Leaflet, and Recharts. It combines a phased itinerary, route maps, GPX-backed hikes, weather guidance, booking-state UI, packing suggestions, and a chronological timeline.

> [!IMPORTANT]
> All dates, flights, lodging, booking states, traveler details, and operational timings in this repository are fictional sample data. This repository does not contain anyone's real travel plans.

## Run locally

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
pnpm lint
pnpm build
```

## Data architecture

All tracked trip fixtures live in [`lib/data`](./lib/data). `lib/tripData.ts` assembles the modular sources into the backward-compatible shapes used by the components. Timeline events are derived from the itinerary, stays, and transport data rather than duplicated manually.

The public fixture deliberately uses:

- far-future 2037 sample dates;
- `ORIGIN` and `Example Air` instead of a real home airport or carrier itinerary;
- generic lodging names and city-level coordinates;
- fictional booking states without confirmation numbers, ticket IDs, property contacts, or passenger data.

See [`lib/data/README.md`](./lib/data/README.md) before changing trip fixtures.

## Privacy boundary

Never commit real names, email addresses, phone numbers, home locations, booking references, ticket numbers, loyalty numbers, passport details, exact active travel dates, or private property contacts.

Traveler-specific overlays and exports belong outside Git. Paths matching `lib/data/*.private.*` and `lib/data/private/` are ignored as a last line of defense, but a password manager or encrypted private store is preferable.

If sensitive data is committed, removing it from the latest revision is not enough: Git history, branches, pull-request refs, action logs, forks, and existing clones may retain it. Rotate any exposed credential and follow GitHub's sensitive-data removal process before changing repository visibility.

## Security

Please report vulnerabilities through GitHub's private vulnerability reporting flow. See [`SECURITY.md`](./SECURITY.md).

## License

Licensed under the [MIT License](./LICENSE).
