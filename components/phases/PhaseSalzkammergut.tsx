import type { Phase } from '@/lib/tripData'
import type { LatLng } from '@/lib/routingService'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DayTimeline } from '@/components/timeline/DayTimeline'
import { DrivingStats } from '@/components/driving/DrivingStats'
import { TrainStats } from '@/components/driving/TrainStats'
import { PhaseMap } from '@/components/map/MapLoader'
import { SuggestedStopsSection } from '@/components/planning/SuggestedStopsSection'

interface PhaseSalzkammergutProps {
  phase: Phase
  drivingRoutes: Record<string, LatLng[]>
  hikingRoutes: Record<string, LatLng[]>
}

export function PhaseSalzkammergut({ phase, drivingRoutes, hikingRoutes }: PhaseSalzkammergutProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden border border-forest-green/30" style={{ height: '420px' }}>
          <PhaseMap phase={phase} height="420px" drivingRoutes={drivingRoutes} hikingRoutes={hikingRoutes} />
        </div>

        <div className="space-y-4">
          <SectionHeader title="Turquoise Lakes" subtitle="Phase 2 · Sept 7–8" />
          <p className="text-cream-muted text-base leading-relaxed">
            Train to Salzburg, pick up the rental car, and explore Austria&apos;s most photogenic lake
            district. Hallstatt at dawn. The Schafbergbahn cog railway in the afternoon.
          </p>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase mb-2 font-medium">
              🚂 Schafbergbahn — Booked
            </div>
            <p className="text-cream-muted text-base leading-relaxed">
              Keep the confirmation handy and use its exact ascent and return times. Sit on the{' '}
              <strong className="text-cream">right side</strong> of the train for the best lake
              views on the ascent, weather and seat availability permitting.
            </p>
          </div>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase mb-2 font-medium">
              ⏰ Hallstatt Timing
            </div>
            <p className="text-cream-muted text-base leading-relaxed">
              Arrive by <strong className="text-cream">7:30 AM</strong> for parking and the old town,
              then be at the rebuilt funicular before its <strong className="text-cream">9:00 AM</strong>{' '}
              first ascent. Book Skywalk-only access and leave at 10:15 AM; a salt-mine tour will not fit.
            </p>
          </div>
        </div>
      </div>

      {phase.trainSegments && phase.trainSegments.length > 0 && (
        <div>
          <h3 className="font-serif-display text-cream text-xl mb-4">Train</h3>
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
