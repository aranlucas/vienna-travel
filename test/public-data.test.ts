/* eslint-disable no-await-in-loop -- Keep filesystem traversal and diagnostics in stable source order. */
import { expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

const dataRoot = path.join(repositoryRoot, "lib", "data");

const checkedExtensions = new Set([".ts", ".tsx", ".json"]);

const checks = [
  {
    reason: "identifying or account-specific property",
    pattern:
      /^\s*(?:confirmation|confirmationNumber|bookingReference|ticketNumber|ticketId|passengerName|travelerName|passportNumber|loyaltyNumber|email|phone)\??\s*:/im,
  },
  {
    reason: "literal email address",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  },
  {
    reason: "identifier-like confirmation text",
    pattern:
      /\b(?:confirmation|booking reference|ticket number|pnr|loyalty number|passport number)\s*(?:#|:|is)\s*[A-Z0-9-]{4,}\b/i,
  },
  {
    reason: "sensitive identifier in a URL query",
    pattern: /[?&](?:token|auth|confirmation|booking|reference|pnr|email)=[^\s'"`&]+/i,
  },
];

type SourceFile = { privatePath: string } | { absolutePath: string; relativePath: string };

async function sourceFiles(directory: string): Promise<SourceFile[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: SourceFile[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(repositoryRoot, absolutePath);

    if (entry.isDirectory()) {
      if (entry.name === "private") {
        files.push({ privatePath: relativePath });
      } else {
        files.push(...(await sourceFiles(absolutePath)));
      }

      continue;
    }

    if (entry.name.includes(".private.")) {
      files.push({ privatePath: relativePath });
    } else if (checkedExtensions.has(path.extname(entry.name))) {
      files.push({ absolutePath, relativePath });
    }
  }

  return files;
}

const files = await sourceFiles(dataRoot);

it("excludes private files and directories from the public data tree", () => {
  expect(files.filter((file) => "privatePath" in file)).toEqual([]);
});

it.each(checks)("excludes $reason from public data", async ({ reason, pattern }) => {
  const failures: string[] = [];

  for (const file of files) {
    if ("privatePath" in file) {
      continue;
    }

    const source = await readFile(file.absolutePath, "utf8");
    const match = pattern.exec(source);

    if (match) {
      const line = source.slice(0, match.index).split("\n").length;
      failures.push(`${file.relativePath}:${line}: ${reason}`);
    }
  }

  expect(failures).toEqual([]);
});
