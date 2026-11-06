// OSRM/OSM CLIs cannot assemble this repository’s canonical route cache and provenance; this command owns that domain-specific refresh.
/* eslint-disable no-console -- This command-line tool reports progress and failures to its caller. */
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prefetchRoutes } from "../lib/route-prefetch";

async function main() {
  const data = await prefetchRoutes(process.argv.includes("--train-only"));
  await writeFile(resolve(process.cwd(), "lib/staticRoutes.json"), JSON.stringify(data, null, 2));
  console.log("Written lib/staticRoutes.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
