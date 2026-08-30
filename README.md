# Austria Expedition 2026

A public-safe copy of the trip planner built with Next.js, TypeScript, Tailwind CSS, Leaflet, and Recharts. It combines a phased itinerary, route maps, GPX-backed hikes, live weather guidance, booking-state UI, packing suggestions, and a chronological timeline.

> [!IMPORTANT]
> The itinerary and operational planning details mirror the private planning source. Traveler identity, contact information, booking confirmations, ticket IDs, loyalty numbers, payment data, and private access links must never be committed here.

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

The public fixture deliberately keeps:

- the same dates, transport, lodging, activities, logistics, and weather locations as the private planning source;
- booking state only when it does not expose an account or reservation identifier;
- no confirmation numbers, ticket IDs, traveler names, personal contacts, loyalty identifiers, payment data, or private provider links.

See [`lib/data/README.md`](./lib/data/README.md) before changing trip fixtures.

## Privacy boundary

Never commit traveler names, personal email addresses or phone numbers, home street addresses, booking references, ticket numbers, loyalty numbers, passport details, payment data, private property contacts, or authenticated provider links.

Traveler-specific overlays and exports belong outside Git. Paths matching `lib/data/*.private.*` and `lib/data/private/` are ignored as a last line of defense, but a password manager or encrypted private store is preferable.

If sensitive data is committed, removing it from the latest revision is not enough: Git history, branches, pull-request refs, action logs, forks, and existing clones may retain it. Rotate any exposed credential and follow GitHub's sensitive-data removal process before changing repository visibility.

## Security

Please report vulnerabilities through GitHub's private vulnerability reporting flow. See [`SECURITY.md`](./SECURITY.md).

## License

Licensed under the [MIT License](./LICENSE).
