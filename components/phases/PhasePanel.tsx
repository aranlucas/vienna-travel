import type { ReactNode } from 'react'
import type { Phase } from '@/lib/tripData'
import type { LatLng } from '@/lib/routingService'
import { STAYS, type Stay } from '@/lib/data/stays'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DayTimeline } from '@/components/timeline/DayTimeline'
import { DrivingStats } from '@/components/driving/DrivingStats'
import { TrainStats } from '@/components/driving/TrainStats'
import { HikeCard } from '@/components/hike/HikeCard'
import { PhaseMap } from '@/components/map/MapLoader'
import { SuggestedStopsSection } from '@/components/planning/SuggestedStopsSection'
import { PHASE_COPY } from '@/components/phases/phaseCallouts'

interface PhasePanelProps {
  phase: Phase
  drivingRoutes: Record<string, LatLng[]>
  hikingRoutes: Record<string, LatLng[]>
  children?: ReactNode
}

function StayFacts({ stay }: { stay: Stay }) {
  return (
    <div className="bg-dark-card border border-forest-green/30 rounded-lg p-4">
      <div className="text-sm text-cream-muted/60 uppercase tracking-widest mb-2">Hotel</div>
      <div className="text-cream font-medium text-base">{stay.propertyName}</div>
      <div className="text-cream-muted text-sm mt-1">{stay.address}</div>
      <div className="text-sm text-cream-muted/60 mt-1">
        In: {stay.checkIn.label} · {stay.checkIn.window}
      </div>
      <div className="text-sm text-cream-muted/60">
        Out: {stay.checkOut.label} · {stay.checkOut.window}
        {` · ${stay.nights} ${stay.nights === 1 ? 'night' : 'nights'}`}
      </div>
      {stay.note && <div className="text-sm text-amber/80 mt-1">{stay.note}</div>}
    </div>
  )
}

export function PhasePanel({ phase, drivingRoutes, hikingRoutes, children }: PhasePanelProps) {
  const stays = STAYS.filter((stay) => stay.phaseId === phase.id)
  const copy = PHASE_COPY[phase.id]
  const callouts = children ?? copy?.callouts
  const title = copy?.title ?? phase.title
  const subtitle = copy?.subtitle ?? `Phase ${phase.number} · ${phase.dates}`
  const trainHeading = copy?.trainHeading ?? 'Train'

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden border border-forest-green/30" style={{ height: '420px' }}>
          <PhaseMap phase={phase} height="420px" drivingRoutes={drivingRoutes} hikingRoutes={hikingRoutes} />
        </div>

        <div className="space-y-4">
          <SectionHeader title={title} subtitle={subtitle} />
          {callouts}
          {stays.map((stay) => (
            <StayFacts key={stay.id} stay={stay} />
          ))}
        </div>
      </div>

      {phase.trainSegments && phase.trainSegments.length > 0 && (
        <div>
          <h3 className="font-serif-display text-cream text-xl mb-4">{trainHeading}</h3>
          <TrainStats segments={phase.trainSegments} />
        </div>
      )}

      {phase.hikes.length > 0 && (
        <div>
          <h3 className="font-serif-display text-cream text-xl mb-4">Hikes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phase.hikes.map((hike) => (
              <HikeCard key={hike.id} hike={hike} />
            ))}
          </div>
        </div>
      )}

      {phase.drivingSegments.length > 0 && (
        <div>
          <h3 className="font-serif-display text-cream text-xl mb-4">Driving</h3>
          <DrivingStats segments={phase.drivingSegments} />
        </div>
      )}

      <div>
        <h3 className="font-serif-display text-cream text-xl mb-4">Day by Day</h3>
        <DayTimeline days={phase.days} />
      </div>

      <SuggestedStopsSection phase={phase} />
    </div>
  )
}
