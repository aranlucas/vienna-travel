<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Trip data

- Edit canonical records in `lib/data/`. Keep `lib/tripData.ts` as an assembly/re-export layer and `lib/confirmedStays.ts` as a compatibility shim; preserve both import entrypoints.
- Store activity times separately: `{ time: '8:30 AM', title: 'Take the gondola' }`.
- Set `phaseId` on days, POIs, hikes and transport segments; phase definitions own grouping and map configuration.
- Derive stay booking status from `Stay.confirmed`. Transport and activity bookings have their own status in `lib/data/logistics.ts`.
- Derive timeline events from transport, stays and activities in `lib/timeline-events.ts`.
- Before changing fixtures, read the [public-data privacy rules](lib/data/README.md).

# Scripts: native first

Before adding a script file or a package script that runs one, use the first suitable option:

1. An existing tool's flag or subcommand; inspect its `--help`.
2. Declarative tool configuration.
3. A maintained tool plugin.
4. A one-line package script calling a native command.
5. A Vitest test for assertions.
6. A custom script for repository-specific behavior only. Its first comment names the native option that could not cover it and why; cover it in Vitest and quote that comment in the PR.

# Libraries first

Prefer existing dependencies, then actively maintained, widely adopted, typed libraries. Reserve custom code for domain logic and glue. Explain dependency choices in the PR; when writing an equivalent by hand, name the library and why it did not fit.

Use `leaflet`/`react-leaflet` for interactive maps, `recharts` for elevation charts, and `zod` for external-service and stored-checklist validation.

## Tests: behavior and contracts

- Before adding a test, identify the specific behavior, a credible mistake it should catch, and an independently justified expected result.
- Prefer small, fast, reliable tests whose failures identify the broken behavior. Use integration/E2E tests for interactions isolated tests cannot establish.
- Do not reproduce implementation logic in assertions or mocks.
- Protect contracts, not incidental internal structure.
- Distinguish temporary development scaffolding from checks worth maintaining.
- Never delete or weaken a failing test just to make the suite pass.
