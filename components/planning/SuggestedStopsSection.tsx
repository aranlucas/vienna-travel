import type { Phase, PointOfInterest } from '@/lib/tripData'
import { buildGoogleMapsUrl } from '@/lib/mapLinks'

interface SuggestedStopsSectionProps {
  phase: Phase
  title?: string
}

function getSuggestedStops(phase: Phase): PointOfInterest[] {
  if (!phase.suggestedStopIds?.length) return []

  return phase.suggestedStopIds.flatMap((id) => {
    const poi = phase.pois.find((entry) => entry.id === id)
    return poi ? [poi] : []
  })
}

export function SuggestedStopsSection({ phase, title = 'Suggested Stops' }: SuggestedStopsSectionProps) {
  const stops = getSuggestedStops(phase)

  if (!stops.length) return null

  return (
    <div>
      <h3 className="font-serif-display text-cream text-xl mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {stops.map((poi) => (
          <div key={poi.id} className="bg-dark-card rounded-lg border border-forest-green/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-cream font-medium text-base">{poi.name}</div>
                <p className="text-sm text-cream-muted mt-1 leading-relaxed">{poi.description}</p>
                {poi.tip && (
                  <p className="text-xs text-emerald-300/90 mt-2 leading-relaxed">{poi.tip}</p>
                )}
                {poi.warning && (
                  <p className="text-xs text-amber/85 mt-2 leading-relaxed">{poi.warning}</p>
                )}
              </div>
              <a
                href={buildGoogleMapsUrl(poi.name, poi.coordinates, poi.googleMapsUrl)}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-sm text-amber underline decoration-amber/40 underline-offset-4"
              >
                Map
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
