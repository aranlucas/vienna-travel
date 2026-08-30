import type { Phase } from '@/lib/tripData'
import type { LatLng } from '@/lib/routingService'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DayTimeline } from '@/components/timeline/DayTimeline'
import { DrivingStats } from '@/components/driving/DrivingStats'
import { TrainStats } from '@/components/driving/TrainStats'
import { HikeCard } from '@/components/hike/HikeCard'
import { PhaseMap } from '@/components/map/MapLoader'
import { SuggestedStopsSection } from '@/components/planning/SuggestedStopsSection'

interface PhaseOlpererProps {
  phase: Phase
  drivingRoutes: Record<string, LatLng[]>
  hikingRoutes: Record<string, LatLng[]>
}

export function PhaseOlperer({ phase, drivingRoutes, hikingRoutes }: PhaseOlpererProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden border border-forest-green/30" style={{ height: '420px' }}>
          <PhaseMap phase={phase} height="420px" drivingRoutes={drivingRoutes} hikingRoutes={hikingRoutes} />
        </div>

        <div className="space-y-4">
          <SectionHeader title="Olpererhütte & Return" subtitle="Phase 4 · Sept 12–14" />
          <p className="text-cream-muted text-base leading-relaxed">
            The finale. A dawn drive into the Zillertal Alps, the iconic suspension bridge photo, then a swift rail
            journey back to Vienna Airport.
          </p>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase font-medium mb-2">💰 Cash at the Hütte</div>
            <p className="text-cream-muted text-base">
              Carry an appropriate cash backup and verify the hut&apos;s current payment options before hiking.
            </p>
          </div>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase font-medium mb-2">
              🚂 Sunday Train (Sept 13)
            </div>
            <p className="text-cream-muted text-base">
              The direct Railjet is <strong className="text-cream">marked booked for the demo</strong>. Check the live
              platform, timetable, and reservation rules in ÖBB Scotty.
            </p>
          </div>

          <div className="bg-dark-card border border-red-900/40 rounded-lg p-4">
            <div className="text-sm text-red-400 tracking-widest uppercase font-medium mb-2">
              🅿️ Innsbruck Airport Return
            </div>
            <p className="text-cream-muted text-base">
              The fictional schedule leaves Schlegeis by 2:30 PM for a{' '}
              <strong className="text-cream">5:30 PM sample airport return</strong>. Verify real road, traffic, fuel,
              and rental-return requirements before travel.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-serif-display text-cream text-xl mb-4">The Hike</h3>
        <div className="max-w-xl">
          {phase.hikes.map((hike) => (
            <HikeCard key={hike.id} hike={hike} />
          ))}
        </div>
      </div>

      {phase.trainSegments && phase.trainSegments.length > 0 && (
        <div>
          <h3 className="font-serif-display text-cream text-xl mb-4">Train Home</h3>
          <TrainStats segments={phase.trainSegments} />
        </div>
      )}

      <div>
        <h3 className="font-serif-display text-cream text-xl mb-4">Driving</h3>
        <DrivingStats segments={phase.drivingSegments} />
      </div>

      <div>
        <h3 className="font-serif-display text-cream text-xl mb-4">Day by Day</h3>
        <DayTimeline days={phase.days} />
      </div>

      <SuggestedStopsSection phase={phase} />
    </div>
  )
}
