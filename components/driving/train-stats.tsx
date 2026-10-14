import type { TrainSegment } from "@/lib/tripData";
import { formatMiles } from "@/lib/units";

interface TrainStatsProps {
  segments: TrainSegment[];
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  if (h === 0) {
    return `${m}min`;
  }

  if (m === 0) {
    return `${h}h`;
  }

  return `${h}h ${m}min`;
}

export function TrainStats({ segments }: TrainStatsProps) {
  if (!segments.length) {
    return null;
  }

  return (
    <div className="grid gap-y-3">
      {segments.map((seg) => (
        <div key={seg.id} className="rounded-lg border border-rail-blue/25 bg-dark-card p-4">
          <div className="mbe-2 flex items-start gap-2">
            <span className="mbs-0.5 shrink-0 text-sm text-rail-blue">🚂</span>
            <div className="min-w-0 flex-1">
              <span className="text-base leading-snug font-medium text-cream">
                {seg.from} → {seg.to}
              </span>
              <span className="ms-2 rounded border border-rail-blue/20 bg-rail-blue/10 px-1.5 py-0.5 text-sm text-rail-blue/80">
                {seg.operator}
              </span>
            </div>
          </div>

          <div className="ms-6 flex flex-wrap gap-4 text-sm text-cream-muted">
            {seg.departureTime && (
              <span className="font-medium text-amber">dep {seg.departureTime}</span>
            )}
            {seg.arrivalTime && (
              <span className="font-medium text-amber">arr {seg.arrivalTime}</span>
            )}
            <span>⏱ {formatDuration(seg.durationHours)}</span>
            <span>📍 ~{formatMiles(seg.distanceKm, 0)}</span>
          </div>

          {seg.notes && (
            <p className="ms-6 mbs-2 border-bs border-rail-blue/15 pbs-2 text-sm leading-relaxed text-cream-muted/70">
              {seg.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
