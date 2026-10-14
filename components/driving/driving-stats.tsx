import type { DrivingSegment } from "@/lib/tripData";
import { formatMiles } from "@/lib/units";

interface DrivingStatsProps {
  segments: DrivingSegment[];
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

export function DrivingStats({ segments }: DrivingStatsProps) {
  if (!segments.length) {
    return null;
  }

  return (
    <div className="grid gap-y-3">
      {segments.map((seg) => (
        <div key={seg.id} className="rounded-lg border border-slate-blue/30 bg-dark-card p-4">
          <div className="mbe-2 flex items-start gap-2">
            <span className="mbs-0.5 shrink-0 text-sm text-amber">🚗</span>
            <div className="min-w-0 flex-1">
              <span className="text-base leading-snug font-medium text-cream">
                {seg.from} → {seg.to}
              </span>
              {seg.scenic && (
                <span className="ms-2 rounded border border-emerald-800/40 bg-emerald-900/20 px-1.5 py-0.5 text-sm text-emerald-400">
                  Scenic
                </span>
              )}
            </div>
          </div>

          <div className="ms-6 flex flex-wrap gap-4 text-sm text-cream-muted">
            <span>⏱ {formatDuration(seg.durationHours)}</span>
            <span>📍 ~{formatMiles(seg.distanceKm, 0)}</span>
            {seg.toll && (
              <span className="text-amber/70">
                🏷 Toll: €{seg.toll.amountEur.toFixed(2)} ({seg.toll.description})
              </span>
            )}
          </div>

          {seg.notes && (
            <p className="ms-6 mbs-2 border-bs border-slate-blue/20 pbs-2 text-sm leading-relaxed text-cream-muted/70">
              {seg.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
