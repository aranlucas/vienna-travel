import type { ReactNode } from "react";
import type { Phase } from "@/lib/tripData";
import type { LatLng } from "@/lib/routing-service";
import { STAYS, type Stay } from "@/lib/data/stays";
import { SectionHeader } from "@/components/ui/section-header";
import { DayTimeline } from "@/components/timeline/day-timeline";
import { DrivingStats } from "@/components/driving/driving-stats";
import { TrainStats } from "@/components/driving/train-stats";
import { HikeCard } from "@/components/hike/hike-card";
import { PhaseMap } from "@/components/map/map-loader";
import { SuggestedStopsSection } from "@/components/planning/suggested-stops-section";
import { PHASE_COPY } from "@/components/phases/phase-callouts";

interface PhasePanelProps {
  phase: Phase;
  drivingRoutes: Record<string, LatLng[]>;
  hikingRoutes: Record<string, LatLng[]>;
  children?: ReactNode;
}

function StayFacts({ stay }: StayFactsProps) {
  return (
    <div className="rounded-lg border border-forest-green/30 bg-dark-card p-4">
      <div className="mbe-2 text-sm tracking-widest text-cream-muted/60 uppercase">Hotel</div>
      <div className="text-base font-medium text-cream">{stay.propertyName}</div>
      <div className="mbs-1 text-sm text-cream-muted">{stay.address}</div>
      <div className="mbs-1 text-sm text-cream-muted/60">
        In: {stay.checkIn.label} · {stay.checkIn.window}
      </div>
      <div className="text-sm text-cream-muted/60">
        Out: {stay.checkOut.label} · {stay.checkOut.window}
        {` · ${stay.nights} ${stay.nights === 1 ? "night" : "nights"}`}
      </div>
      {stay.note && <div className="mbs-1 text-sm text-amber/80">{stay.note}</div>}
    </div>
  );
}

export function PhasePanel({ phase, drivingRoutes, hikingRoutes, children }: PhasePanelProps) {
  const stays = STAYS.filter((stay) => stay.phaseId === phase.id);
  const copy = PHASE_COPY.get(phase.id);
  const callouts = children ?? copy?.callouts;
  const title = copy?.title ?? phase.title;
  const subtitle = copy?.subtitle ?? `Phase ${phase.number} · ${phase.dates}`;
  const trainHeading = copy?.trainHeading ?? "Train";

  return (
    <div className="grid gap-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div
          className="overflow-hidden rounded-xl border border-forest-green/30"
          style={{ height: "420px" }}
        >
          <PhaseMap
            phase={phase}
            height="420px"
            drivingRoutes={drivingRoutes}
            hikingRoutes={hikingRoutes}
          />
        </div>

        <div className="grid gap-y-4">
          <SectionHeader title={title} subtitle={subtitle} />
          {callouts}
          {stays.map((stay) => (
            <StayFacts key={stay.id} stay={stay} />
          ))}
        </div>
      </div>

      {phase.trainSegments && phase.trainSegments.length > 0 && (
        <div>
          <h3 className="mbe-4 font-serif-display text-xl text-cream">{trainHeading}</h3>
          <TrainStats segments={phase.trainSegments} />
        </div>
      )}

      {phase.hikes.length > 0 && (
        <div>
          <h3 className="mbe-4 font-serif-display text-xl text-cream">Hikes</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {phase.hikes.map((hike) => (
              <HikeCard key={hike.id} hike={hike} />
            ))}
          </div>
        </div>
      )}

      {phase.drivingSegments.length > 0 && (
        <div>
          <h3 className="mbe-4 font-serif-display text-xl text-cream">Driving</h3>
          <DrivingStats segments={phase.drivingSegments} />
        </div>
      )}

      <div>
        <h3 className="mbe-4 font-serif-display text-xl text-cream">Day by Day</h3>
        <DayTimeline days={phase.days} />
      </div>

      <SuggestedStopsSection phase={phase} />
    </div>
  );
}

type StayFactsProps = { stay: Stay };
