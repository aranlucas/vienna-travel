"use client";

import type { PlanningShortlistItem } from "@/lib/tripData";
import { useTripProgress } from "./trip-progress-context";

interface PlanningShortlistSectionProps {
  items: PlanningShortlistItem[];
}

function priorityClass(priority: PlanningShortlistItem["priority"]) {
  switch (priority) {
    case "Book now":
      return "border-red-400/40 text-red-200 bg-red-950/20";
    case "Soon":
      return "border-amber/40 text-amber bg-amber/10";
    case "Nice to have":
      return "border-forest-green/30 text-emerald-300 bg-emerald-950/20";
  }

  throw new Error(`Unknown planning priority: ${String(priority)}`);
}

export function PlanningShortlistSection({ items }: PlanningShortlistSectionProps) {
  const { today, showPast } = useTripProgress();
  const visibleItems = items.filter((item) => showPast || !item.endDate || item.endDate >= today);

  if (!visibleItems.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pbe-16">
      <details className="rounded-xl border border-forest-green/25 bg-dark-card px-4 py-2">
        <summary className="min-h-touch-roomy cursor-pointer py-2 text-sm text-cream-muted">
          Dining ideas &amp; backups · {visibleItems.length} shortlists
        </summary>
        <p className="mbe-4 text-sm text-cream-muted">
          Optional places to consider when you want another meal option.
        </p>

        <div className="grid gap-y-3">
          {visibleItems.map((item) => (
            <details
              key={item.id}
              className="group scroll-mbs-20 rounded-lg border border-forest-green/30 bg-dark-card p-4"
            >
              <summary className="flex min-h-touch cursor-pointer list-none items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-medium text-cream">{item.title}</h3>
                  <p className="mbs-1 text-xs tracking-label-compact text-cream-muted/80 uppercase">
                    {item.area}
                  </p>
                  <p className="mbs-2 text-sm leading-relaxed text-cream-muted">{item.why}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-1 text-xs ${priorityClass(item.priority)}`}
                >
                  {item.priority}
                </span>
              </summary>
              <div className="mbs-4 grid grid-cols-1 gap-3 border-bs border-forest-green/20 pbs-4 md:grid-cols-2 xl:grid-cols-3">
                {item.options.map((option) => (
                  <a
                    key={option.href}
                    href={option.href}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-touch rounded-lg border border-forest-green/30 p-3 transition-colors hover:border-amber/40"
                  >
                    <div className="text-sm leading-snug font-medium text-amber">
                      {option.label}
                    </div>
                    {option.note && (
                      <p className="mbs-2 text-xs leading-relaxed text-cream-muted">
                        {option.note}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </details>
          ))}
        </div>
      </details>
    </section>
  );
}
