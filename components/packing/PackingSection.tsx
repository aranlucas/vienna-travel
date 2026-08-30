import type { DayPlan, PackingPlan } from '@/lib/tripData'
import { ForecastPackingSummary } from '@/components/packing/ForecastPackingSummary'

interface PackingSectionProps {
  packing: PackingPlan
  days: DayPlan[]
}

const TONE_STYLES: Record<NonNullable<PackingPlan['groups'][number]['tone']>, string> = {
  default: 'bg-dark-card border-forest-green/25',
  info: 'bg-slate-blue/12 border-slate-blue/30',
  warning: 'bg-amber/5 border-amber/20',
}

export function PackingSection({ packing, days }: PackingSectionProps) {
  return (
    <section className="px-6 pb-20 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-8 bg-amber/60" />
        <span className="text-amber text-sm tracking-[0.3em] uppercase font-medium">{packing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
        <div className="bg-dark-card border border-forest-green/30 rounded-xl p-5">
          <p className="text-cream text-base leading-relaxed">{packing.intro}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
            <div className="rounded-lg border border-amber/20 bg-amber/5 p-4">
              <div className="text-xs text-amber tracking-[0.22em] uppercase font-medium mb-2">Cabin Rule</div>
              <p className="text-sm text-cream-muted leading-relaxed">{packing.baggageRule}</p>
            </div>

            <div className="rounded-lg border border-slate-blue/30 bg-slate-blue/12 p-4">
              <div className="text-xs text-blue-200 tracking-[0.22em] uppercase font-medium mb-2">Pack Smart</div>
              <p className="text-sm text-cream-muted leading-relaxed">{packing.strategy}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber/20 bg-amber/5 p-5">
          <div className="text-xs text-amber tracking-[0.22em] uppercase font-medium mb-2">Why This Works</div>
          <ul className="space-y-2 text-sm text-cream-muted leading-relaxed">
            <li>• Vienna still gets a proper dinner outfit, but only one.</li>
            <li>
              • Fleece + packable insulation + shell covers hot valleys through cold summit wind without a bulky
              coat.
            </li>
            <li>
              • Each personal item becomes a real daypack, so water, dry layers, and safety gear are split sensibly.
            </li>
            <li>• A Sept 9 laundry reset makes five underwear and sock rotations realistic.</li>
          </ul>
        </div>
      </div>

      <ForecastPackingSummary days={days} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-6">
        {packing.groups.map((group) => {
          const tone = group.tone ?? 'default'
          return (
            <div key={group.title} className={`rounded-xl border p-4 ${TONE_STYLES[tone]}`}>
              <div className="mb-3">
                <h3 className="text-cream font-medium text-base">{group.title}</h3>
                {group.subtitle && (
                  <div className="text-xs text-cream-muted/60 tracking-[0.18em] uppercase mt-1">{group.subtitle}</div>
                )}
              </div>

              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-cream-muted">
                    <span className="text-amber/60 shrink-0 mt-0.5">•</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
