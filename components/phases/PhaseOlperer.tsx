import type { Phase } from '@/lib/tripData'
import type { LatLng } from '@/lib/routingService'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DayTimeline } from '@/components/timeline/DayTimeline'
import { DrivingStats } from '@/components/driving/DrivingStats'
import { TrainStats } from '@/components/driving/TrainStats'
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
          <SectionHeader title={phase.title} subtitle="Pertisau · Innsbruck" />
          <p className="text-cream-muted text-base leading-relaxed">
            Drive to Pertisau at 9:30 AM for a short 20–30 minute flat lakeside stroll, then settle in for lunch and a
            café stop. Leave Pertisau at 2:30 PM and allow roughly 90 minutes for the return drive, plus buffer.
          </p>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase font-medium mb-2">🌿 Low-walking day</div>
            <p className="text-cream-muted text-base">
              Keep the lakeside stroll flat and short, with plenty of time seated for lunch and coffee.
            </p>
          </div>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase font-medium mb-2">
              🚂 Sunday Train (Sept 13)
            </div>
            <p className="text-cream-muted text-base">
              RJX 13479 to Vienna Airport is <strong className="text-cream">booked in 1st class</strong> with seat
              reservations. Keep the confirmation offline and check the platform in ÖBB Scotty.
            </p>
          </div>

          <div className="bg-dark-card border border-red-900/40 rounded-lg p-4">
            <div className="text-sm text-red-400 tracking-widest uppercase font-medium mb-2">
              🅿️ Innsbruck Airport Return
            </div>
            <p className="text-cream-muted text-base">
              Leave Pertisau at 2:30 PM for the estimated 90-minute return drive, keeping buffer for traffic. Refuel by
              4:30 PM, reach the return area by 5:00 PM, and keep the confirmed{' '}
              <strong className="text-cream">SIXT airport return fixed at 5:30 PM</strong>. Follow the current branch
              signs and key-return instructions.
            </p>
          </div>
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
