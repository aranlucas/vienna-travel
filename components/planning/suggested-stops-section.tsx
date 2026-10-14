import type { Phase, PointOfInterest } from "@/lib/tripData";
import { buildGoogleMapsUrl } from "@/lib/map-links";

interface SuggestedStopsSectionProps {
  phase: Phase;
  title?: string;
}

function getSuggestedStops(phase: Phase): PointOfInterest[] {
  if (!phase.suggestedStopIds?.length) {
    return [];
  }

  return phase.suggestedStopIds.flatMap((id) => {
    const poi = phase.pois.find((entry) => entry.id === id);

    return poi ? [poi] : [];
  });
}

export function SuggestedStopsSection({
  phase,
  title = "Suggested Stops",
}: SuggestedStopsSectionProps) {
  const stops = getSuggestedStops(phase);

  if (!stops.length) {
    return null;
  }

  return (
    <div>
      <h3 className="mbe-4 font-serif-display text-xl text-cream">{title}</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {stops.map((poi) => (
          <div key={poi.id} className="rounded-lg border border-forest-green/30 bg-dark-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-base font-medium text-cream">{poi.name}</div>
                <p className="mbs-1 text-sm leading-relaxed text-cream-muted">{poi.description}</p>
                {poi.tip && (
                  <p className="mbs-2 text-xs leading-relaxed text-emerald-300/90">{poi.tip}</p>
                )}
                {poi.warning && (
                  <p className="mbs-2 text-xs leading-relaxed text-amber/85">{poi.warning}</p>
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
  );
}
