'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'

interface ChecklistItem {
  item: string
  critical: boolean
}

const STORAGE_KEY = 'predeparture-checklist-v1'
const STORAGE_EVENT = 'predeparture-checklist-change'

// Items that matter most on departure eve — matched by stable prefixes.
const TONIGHT_PREFIXES = [
  'Tonight after 7:50 PM PT',
  'Friday flight plan',
  'Save an offline travel folder',
  'Arrival connectivity',
  'Under-seat essentials',
  'Final bag check on Sept 3',
]

function isTonightItem(item: string): boolean {
  return TONIGHT_PREFIXES.some((prefix) => item.startsWith(prefix))
}

// localStorage is an external store: useSyncExternalStore keeps SSR, hydration,
// and cross-tab updates consistent with no effects. The `storage` event covers
// other tabs; STORAGE_EVENT covers writes from this tab (which never fire `storage`).
function subscribe(onChange: () => void): () => void {
  window.addEventListener('storage', onChange)
  window.addEventListener(STORAGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(STORAGE_EVENT, onChange)
  }
}

function getSnapshot(): string {
  return window.localStorage.getItem(STORAGE_KEY) ?? '{}'
}

function getServerSnapshot(): string {
  return '{}'
}

function parseChecked(snapshot: string): Record<number, boolean> {
  try {
    const parsed: unknown = JSON.parse(snapshot)
    if (parsed && typeof parsed === 'object') return parsed as Record<number, boolean>
  } catch {
    // Corrupted storage — treat as empty rather than crashing.
  }
  return {}
}

function writeChecked(next: Record<number, boolean>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage unavailable — checklist still works for the session.
  }
  window.dispatchEvent(new Event(STORAGE_EVENT))
}

export function PreDepartureChecklist({ items }: { items: ChecklistItem[] }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const checked = useMemo(() => parseChecked(snapshot), [snapshot])
  const [tonightOnly, setTonightOnly] = useState(false)

  const visible = useMemo(
    () => items.map((item, index) => ({ ...item, index })).filter((entry) => !tonightOnly || isTonightItem(entry.item)),
    [items, tonightOnly],
  )
  const doneCount = items.filter((_, index) => checked[index]).length

  const toggle = (index: number) => {
    writeChecked({ ...checked, [index]: !checked[index] })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <p className="text-sm text-cream-muted" aria-live="polite">
          {doneCount} of {items.length} done
        </p>
        <div className="h-1.5 min-w-24 flex-1 overflow-hidden rounded-full bg-forest-green/30">
          <div
            className="h-full rounded-full bg-amber transition-all"
            style={{ width: `${items.length ? Math.round((doneCount / items.length) * 100) : 0}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => setTonightOnly((v) => !v)}
          aria-pressed={tonightOnly}
          className={`inline-flex min-h-[44px] items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
            tonightOnly
              ? 'border-amber bg-amber text-dark-surface'
              : 'border-forest-green/40 text-cream-muted hover:border-amber/50 hover:text-cream'
          }`}
        >
          {tonightOnly ? 'Show all' : 'Tonight only'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {visible.map(({ item, critical, index }) => {
          const done = !!checked[index]
          return (
            <label
              key={index}
              className={`flex min-h-[48px] cursor-pointer gap-3 rounded-lg border p-3 text-base ${
                done
                  ? 'border-forest-green/25 bg-dark-card opacity-70'
                  : critical
                    ? 'border-amber/30 bg-amber/5 text-cream'
                    : 'border-forest-green/20 bg-dark-card text-cream-muted'
              }`}
            >
              <input
                type="checkbox"
                checked={done}
                onChange={() => toggle(index)}
                className="mt-1 h-5 w-5 shrink-0 accent-amber"
              />
              <span className={`leading-snug ${done ? 'line-through' : ''}`}>{item}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
