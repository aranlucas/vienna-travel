import type { TrainSegment } from '@/lib/tripData'
import { formatMiles } from '@/lib/units'

interface TrainStatsProps {
  segments: TrainSegment[]
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export function TrainStats({ segments }: TrainStatsProps) {
  if (!segments.length) return null

  return (
    <div className="space-y-3">
      {segments.map((seg) => (
        <div key={seg.id} className="bg-dark-card rounded-lg border border-[#4a9eb5]/25 p-4">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-[#4a9eb5] text-sm mt-0.5 shrink-0">🚂</span>
            <div className="flex-1 min-w-0">
              <span className="text-cream text-base font-medium leading-snug">
                {seg.from} → {seg.to}
              </span>
              <span className="ml-2 text-sm text-[#4a9eb5]/80 bg-[#4a9eb5]/10 border border-[#4a9eb5]/20 px-1.5 py-0.5 rounded">
                {seg.operator}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-cream-muted ml-6">
            {seg.departureTime && (
              <span className="text-amber font-medium">dep {seg.departureTime}</span>
            )}
            {seg.arrivalTime && (
              <span className="text-amber font-medium">arr {seg.arrivalTime}</span>
            )}
            <span>⏱ {formatDuration(seg.durationHours)}</span>
            <span>📍 ~{formatMiles(seg.distanceKm, 0)}</span>
          </div>

          {seg.notes && (
            <p className="mt-2 text-sm text-cream-muted/70 leading-relaxed border-t border-[#4a9eb5]/15 pt-2 ml-6">
              {seg.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
