import type { Phase } from '@/lib/tripData'
import type { LatLng } from '@/lib/routingService'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DayTimeline } from '@/components/timeline/DayTimeline'
import { PhaseMap } from '@/components/map/MapLoader'
import { SuggestedStopsSection } from '@/components/planning/SuggestedStopsSection'

interface PhaseViennaProps {
  phase: Phase
  drivingRoutes: Record<string, LatLng[]>
  hikingRoutes: Record<string, LatLng[]>
}

export function PhaseVienna({ phase, drivingRoutes, hikingRoutes }: PhaseViennaProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden border border-forest-green/30" style={{ height: '420px' }}>
          <PhaseMap phase={phase} height="420px" drivingRoutes={drivingRoutes} hikingRoutes={hikingRoutes} />
        </div>

        <div className="space-y-4">
          <SectionHeader title="Imperial Vienna" subtitle="Phase 1 · Sept 5–6" />
          <p className="text-cream-muted text-base leading-relaxed">
            Cultural immersion and logistics. Vienna&apos;s grand boulevards, baroque palaces, and
            legendary coffeehouses set the stage before the mountains begin.
          </p>

          <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
            <div className="text-sm text-amber tracking-widest uppercase mb-2 font-medium">
              ⚠️ Critical: Naschmarkt
            </div>
            <p className="text-cream-muted text-base leading-relaxed">
              Visit <strong className="text-cream">Saturday Sept 5 only</strong> — buy nuts, dried
              fruits, and alpine cheese for the hikes. The market is strictly closed on Sundays.
            </p>
          </div>

          <div className="bg-dark-card border border-forest-green/30 rounded-lg p-4">
            <div className="text-sm text-cream-muted/60 uppercase tracking-widest mb-2">Hotel</div>
            <div className="text-cream font-medium text-base">Almanac Palais Vienna</div>
            <div className="text-cream-muted text-sm mt-1">Vienna city centre</div>
            <div className="text-sm text-cream-muted/60 mt-1">Sept 5 check-in 3PM → Sept 7 checkout noon</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-serif-display text-cream text-xl mb-4">Day by Day</h3>
        <DayTimeline days={phase.days} />
      </div>

      <SuggestedStopsSection phase={phase} />
    </div>
  )
}
