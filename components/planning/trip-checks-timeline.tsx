"use client";

import type { LiveCheckItem } from "@/lib/tripData";
import { ActivityDetails } from "@/components/timeline/activity-details";
import { useTripProgress } from "./trip-progress-context";

interface TripChecksTimelineProps {
  items: LiveCheckItem[];
}

function formatDueDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T12:00:00Z`));
}

export function TripChecksTimeline({ items }: TripChecksTimelineProps) {
  const { today, showPast } = useTripProgress();
  const visibleItems = items.filter((item) => showPast || item.dueDate >= today);
  const sorted = [...visibleItems].toSorted((a, b) => a.dueDate.localeCompare(b.dueDate));

  if (!sorted.length) {
    return (
      <div className="max-w-5xl rounded-xl border border-forest-green/25 bg-dark-card p-5">
        <p className="text-base font-medium text-cream">
          {items.length ? "No upcoming checks." : "No live checks are scheduled."}
        </p>
        {items.length > 0 && (
          <p className="mbs-2 text-sm leading-relaxed text-cream-muted">
            All check dates have passed. Show past days above to review them.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-2">
      {sorted.map((item) => {
        const accentClass =
          item.kind === "Reservation"
            ? "border-amber/20 bg-amber/4"
            : "border-slate-blue/25 bg-slate-blue/8";

        return (
          <article key={item.id} className={`rounded-xl border p-4 ${accentClass}`}>
            <div className="mbe-3 flex flex-wrap items-center gap-2">
              <span className="text-caption font-medium tracking-eyebrow-wide text-amber uppercase">
                {formatDueDate(item.dueDate)}
              </span>
              <span className="rounded-full border border-forest-green/30 bg-dark-card px-2 py-0.5 text-caption-small tracking-eyebrow text-cream-muted/80 uppercase">
                {item.scope}
              </span>
              <span className="rounded-full border border-amber/20 bg-dark-card px-2 py-0.5 text-caption-small tracking-eyebrow text-cream-muted/80 uppercase">
                {item.kind}
              </span>
            </div>
            <h3 className="font-serif-display text-xl leading-tight text-cream">{item.title}</h3>
            <p className="mbs-2 text-sm leading-relaxed text-cream-muted">{item.description}</p>
            {item.note && (
              <p className="mbs-3 text-xs leading-relaxed text-cream-muted/75">{item.note}</p>
            )}
            <ActivityDetails links={item.links} label="Sources & actions" />
          </article>
        );
      })}
    </div>
  );
}
