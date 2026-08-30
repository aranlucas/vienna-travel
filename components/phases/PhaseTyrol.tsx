import type { Phase } from '@/lib/tripData'
import type { LatLng } from '@/lib/routingService'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DayTimeline } from '@/components/timeline/DayTimeline'
import { DrivingStats } from '@/components/driving/DrivingStats'
import { HikeCard } from '@/components/hike/HikeCard'
import { PhaseMap } from '@/components/map/MapLoader'
import { SuggestedStopsSection } from '@/components/planning/SuggestedStopsSection'

interface PhaseTyrolProps {
  phase: Phase
  drivingRoutes: Record<string, LatLng[]>
  hikingRoutes: Record<string, LatLng[]>
}

export function PhaseTyrol({ phase, drivingRoutes, hikingRoutes }: PhaseTyrolProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden border border-forest-green/30" style={{ height: '420px' }}>
          <PhaseMap phase={phase} height="420px" drivingRoutes={drivingRoutes} hikingRoutes={hikingRoutes} />
        </div>

        <div className="space-y-4">
          <SectionHeader title="Tyrolean Alps" subtitle="Phase 3 · Sept 9–11" />
          <p className="text-cream-muted text-base leading-relaxed">
            Three days based in Ehrwald at the foot of the Zugspitze. Suspension bridges, emerald
            alpine lakes, ghost-tree reflections, and a 9,718 ft summit straddling two countries.
          </p>

          <div className="bg-dark-card border border-forest-green/30 rounded-lg p-4">
            <div className="text-sm text-cream-muted/60 uppercase tracking-widest mb-2">Base</div>
            <div className="text-cream font-medium text-base">der grüne Baum Mountain Boutique Hotel</div>
            <div className="text-cream-muted text-sm mt-1">Sept 9–11 (2 nights)</div>
          </div>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase mb-2 font-medium">
              💰 Cash Required
            </div>
            <p className="text-cream-muted text-base">
              Bring <strong className="text-cream">€50+ cash</strong> for the Coburger Hütte
              mountain hut (cards unreliable at altitude).
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-serif-display text-cream text-xl mb-4">Hikes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phase.hikes.map((hike) => (
            <HikeCard key={hike.id} hike={hike} />
          ))}
        </div>
      </div>

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
