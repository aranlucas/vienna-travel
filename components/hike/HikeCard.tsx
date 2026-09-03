import type { Hike } from '@/lib/tripData'
import { Badge } from '@/components/ui/Badge'
import { formatFeet, formatMiles } from '@/lib/units'
import { HikeElevation } from './HikeElevation'

interface HikeCardProps {
  hike: Hike
}

export function HikeCard({ hike }: HikeCardProps) {
  return (
    <div className="bg-dark-card rounded-lg border border-forest-green/40 overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif-display text-cream text-lg leading-snug">{hike.name}</h3>
          <Badge difficulty={hike.difficulty}>{hike.difficulty}</Badge>
        </div>
        <p className="text-cream-muted text-base leading-relaxed">{hike.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="distance">🥾 {formatMiles(hike.distanceKm)}</Badge>
          <Badge variant="elevation">↑ {formatFeet(hike.elevationGainM)} gain</Badge>
          <Badge variant="info">{hike.gpxStatus === 'reference' ? 'Reference GPX' : 'GPX Verified'}</Badge>
        </div>
      </div>

      <div className="px-2 pb-2">
        <HikeElevation data={hike.elevationProfile} height={110} />
      </div>

      {hike.highlights.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {hike.highlights.map((h, i) => (
              <span
                key={i}
                className="text-sm text-cream-muted bg-forest-green/20 px-2 py-0.5 rounded-full border border-forest-green/30"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {hike.tips && (
        <div className="mx-4 mb-4 p-3 bg-amber/5 border border-amber/20 rounded text-sm text-amber/80 leading-relaxed">
          💡 {hike.tips}
        </div>
      )}

      <div className="px-4 pb-4">
        <a
          href={hike.gpxFile}
          download
          className="inline-flex items-center gap-2 text-sm text-blue-200 underline decoration-blue-300/40 underline-offset-4"
        >
          {hike.gpxDownloadLabel ?? 'Download GPX'}
        </a>
      </div>
    </div>
  )
}
