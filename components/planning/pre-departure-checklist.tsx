"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { DepartureChecklistItem } from "@/lib/data/logistics";
import { checklistStore } from "./checklist-store";

export function PreDepartureChecklist({ items }: PreDepartureChecklistProps) {
  const snapshot = useSyncExternalStore(
    checklistStore.subscribe,
    checklistStore.getSnapshot,
    checklistStore.getServerSnapshot,
  );

  const checked = useMemo(() => checklistStore.read(snapshot, items), [snapshot, items]);
  const [tonightOnly, setTonightOnly] = useState(false);

  const visible = useMemo(
    () => items.filter((entry) => !tonightOnly || entry.tonight),
    [items, tonightOnly],
  );

  const doneCount = items.filter(({ id }) => checked[id]).length;

  const toggle = (id: string) => {
    checklistStore.write({ ...checked, [id]: !checked[id] });
  };

  return (
    <div>
      <div className="mbe-4 flex flex-wrap items-center gap-3">
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
          className={`inline-flex min-h-touch items-center rounded-full border px-4 text-xs font-semibold tracking-label-compact uppercase transition-colors ${
            tonightOnly
              ? "border-amber bg-amber text-dark-surface"
              : "border-forest-green/40 text-cream-muted hover:border-amber/50 hover:text-cream"
          }`}
        >
          {tonightOnly ? "Show all" : "Tonight only"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {visible.map(({ id, item, critical }) => {
          const done = checked[id] ?? false;

          return (
            <label
              key={id}
              className={`flex min-h-touch-roomy cursor-pointer gap-3 rounded-lg border p-3 text-base ${
                done
                  ? "border-forest-green/25 bg-dark-card opacity-70"
                  : critical
                    ? "border-amber/30 bg-amber/5 text-cream"
                    : "border-forest-green/20 bg-dark-card text-cream-muted"
              }`}
            >
              <input
                type="checkbox"
                checked={done}
                onChange={() => toggle(id)}
                className="mbs-1 size-5 shrink-0 accent-amber"
              />
              <span className={`leading-snug ${done ? "line-through" : ""}`}>{item}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

type PreDepartureChecklistProps = { items: DepartureChecklistItem[] };
