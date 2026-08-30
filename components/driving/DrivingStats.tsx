import type { DrivingSegment } from '@/lib/tripData'
import { formatMiles } from '@/lib/units'

interface DrivingStatsProps {
  segments: DrivingSegment[]
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export function DrivingStats({ segments }: DrivingStatsProps) {
  if (!segments.length) return null

  return (
    <div className="space-y-3">
      {segments.map((seg) => (
        <div key={seg.id} className="bg-dark-card rounded-lg border border-slate-blue/30 p-4">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-amber text-sm mt-0.5 shrink-0">🚗</span>
            <div className="flex-1 min-w-0">
              <span className="text-cream text-base font-medium leading-snug">
                {seg.from} → {seg.to}
              </span>
              {seg.scenic && (
                <span className="ml-2 text-sm text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                  Scenic
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-cream-muted ml-6">
            <span>⏱ {formatDuration(seg.durationHours)}</span>
            <span>📍 ~{formatMiles(seg.distanceKm, 0)}</span>
            {seg.toll && (
              <span className="text-amber/70">
                🏷 Toll: €{seg.toll.amountEur.toFixed(2)} ({seg.toll.description})
              </span>
            )}
          </div>

          {seg.notes && (
            <p className="mt-2 text-sm text-cream-muted/70 leading-relaxed border-t border-slate-blue/20 pt-2 ml-6">
              {seg.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
