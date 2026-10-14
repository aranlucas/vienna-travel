import type { Hike } from "@/lib/tripData";
import { Badge } from "@/components/ui/badge";
import { formatFeet, formatMiles } from "@/lib/units";
import { HikeElevation } from "./hike-elevation";

interface HikeCardProps {
  hike: Hike;
}

export function HikeCard({ hike }: HikeCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-forest-green/40 bg-dark-card">
      <div className="px-4 pbs-4 pbe-3">
        <div className="mbe-2 flex items-start justify-between gap-2">
          <h3 className="font-serif-display text-lg leading-snug text-cream">{hike.name}</h3>
          <Badge difficulty={hike.difficulty}>{hike.difficulty}</Badge>
        </div>
        <p className="text-base leading-relaxed text-cream-muted">{hike.description}</p>
        <div className="mbs-3 flex flex-wrap gap-2">
          <Badge variant="distance">🥾 {formatMiles(hike.distanceKm)}</Badge>
          <Badge variant="elevation">↑ {formatFeet(hike.elevationGainM)} gain</Badge>
          <Badge variant="info">
            {hike.gpxStatus === "reference" ? "Reference GPX" : "GPX Verified"}
          </Badge>
        </div>
      </div>

      <div className="px-2 pbe-2">
        <HikeElevation data={hike.elevationProfile} height={110} />
      </div>

      {hike.highlights.length > 0 && (
        <div className="px-4 pbe-3">
          <div className="flex flex-wrap gap-1.5">
            {hike.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full border border-forest-green/30 bg-forest-green/20 px-2 py-0.5 text-sm text-cream-muted"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {hike.tips && (
        <div className="mx-4 mbe-4 rounded border border-amber/20 bg-amber/5 p-3 text-sm leading-relaxed text-amber/80">
          💡 {hike.tips}
        </div>
      )}

      <div className="px-4 pbe-4">
        <a
          href={hike.gpxFile}
          download
          className="inline-flex items-center gap-2 text-sm text-blue-200 underline decoration-blue-300/40 underline-offset-4"
        >
          {hike.gpxDownloadLabel ?? "Download GPX"}
        </a>
      </div>
    </div>
  );
}
