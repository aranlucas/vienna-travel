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
            The finale. A dawn drive into the Zillertal Alps, the iconic suspension bridge photo,
            then a swift rail journey back to Vienna Airport.
          </p>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase font-medium mb-2">
              💰 Cash at the Hütte
            </div>
            <p className="text-cream-muted text-base">
              Bring <strong className="text-cream">€100+ cash</strong>. The Olpererhütte card reader
              is unreliable at 7,835 ft.
            </p>
          </div>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase font-medium mb-2">
              🚂 Sunday Train (Sept 13)
            </div>
            <p className="text-cream-muted text-base">
              RJX 13479 to Vienna Airport is <strong className="text-cream">booked in 1st class</strong>{' '}
              with seat reservations. Keep the confirmation offline and check the platform in ÖBB Scotty.
            </p>
          </div>

          <div className="bg-dark-card border border-red-900/40 rounded-lg p-4">
            <div className="text-sm text-red-400 tracking-widest uppercase font-medium mb-2">
              🅿️ Innsbruck Airport Return
            </div>
            <p className="text-cream-muted text-base">
              Leave Schlegeis no later than 2:30 PM for the confirmed{' '}
              <strong className="text-cream">5:30 PM airport return</strong>. Passenger cars use
              parking area A; follow the blue &ldquo;Car rental return&rdquo; signs.
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
