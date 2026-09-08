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
            Train to Salzburg, pick up the rental car, and explore Austria&apos;s most photogenic lake district.
            September 8 stays local: morning red train, then cycling and swimming in Strobl.
          </p>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase mb-2 font-medium">
              🚂 Schafbergbahn — Plan to book
            </div>
            <p className="text-cream-muted text-base leading-relaxed">
              Published daily service: 9:15 AM up (arrive 9:50), 12:05 PM down (arrive 12:40). €61 per adult return.
              Seats are not reserved; book both directions together.
            </p>
          </div>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase mb-2 font-medium">
              🚲 Afternoon bike + swim
            </div>
            <p className="text-cream-muted text-base leading-relaxed">
              Collect bikes in St. Wolfgang at 2:00 PM, ride the R2 to Strobl, and swim at Felmayerbad, Seestraße 8.
              Leave the beach at 4:30 PM and return bikes by 5:30 PM. Pro Travel is the first choice; See-Biker is the
              local fallback. Neither is booked.
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
