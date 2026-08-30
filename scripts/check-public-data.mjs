import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataRoot = path.join(repositoryRoot, 'lib', 'data')
const checkedExtensions = new Set(['.ts', '.tsx', '.json'])

const checks = [
  {
    reason: 'identifying or account-specific property',
    pattern:
      /^\s*(?:confirmation|confirmationNumber|bookingReference|ticketNumber|ticketId|passengerName|travelerName|passportNumber|loyaltyNumber|email|phone)\??\s*:/im,
  },
  {
    reason: 'literal email address',
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  },
  {
    reason: 'identifier-like confirmation text',
    pattern:
      /\b(?:confirmation|booking reference|ticket number|pnr|loyalty number|passport number)\s*(?:#|:|is)\s*[A-Z0-9-]{4,}\b/i,
  },
  {
    reason: 'sensitive identifier in a URL query',
    pattern: /[?&](?:token|auth|confirmation|booking|reference|pnr|email)=[^\s'"`&]+/i,
  },
]

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)
    const relativePath = path.relative(repositoryRoot, absolutePath)

    if (entry.isDirectory()) {
      if (entry.name === 'private') {
        files.push({ privatePath: relativePath })
      } else {
        files.push(...(await sourceFiles(absolutePath)))
      }
      continue
    }

    if (entry.name.includes('.private.')) {
      files.push({ privatePath: relativePath })
    } else if (checkedExtensions.has(path.extname(entry.name))) {
      files.push({ absolutePath, relativePath })
    }
  }

  return files
}

const failures = []
for (const file of await sourceFiles(dataRoot)) {
  if (file.privatePath) {
    failures.push(`${file.privatePath}: private data path must not be present in the public tree`)
    continue
  }

  const source = await readFile(file.absolutePath, 'utf8')
  for (const check of checks) {
    const match = check.pattern.exec(source)
    if (!match) continue
    const line = source.slice(0, match.index).split('\n').length
    failures.push(`${file.relativePath}:${line}: ${check.reason}`)
  }
}

if (failures.length > 0) {
  console.error('Public-data privacy check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log('Public-data privacy check passed.')
}
