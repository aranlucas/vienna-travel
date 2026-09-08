'use client'

import type { PlanningShortlistItem } from '@/lib/tripData'
import { useTripProgress } from './TripProgress'

interface PlanningShortlistSectionProps {
  items: PlanningShortlistItem[]
}

function priorityClass(priority: PlanningShortlistItem['priority']) {
  switch (priority) {
    case 'Book now':
      return 'border-red-400/40 text-red-200 bg-red-950/20'
    case 'Soon':
      return 'border-amber/40 text-amber bg-amber/10'
    default:
      return 'border-forest-green/30 text-emerald-300 bg-emerald-950/20'
  }
}

export function PlanningShortlistSection({ items }: PlanningShortlistSectionProps) {
  const { today, showPast } = useTripProgress()
  const visibleItems = items.filter((item) => showPast || !item.endDate || item.endDate >= today)
  if (!visibleItems.length) return null
  return (
    <section className="px-6 pb-16 max-w-6xl mx-auto">
      <details className="rounded-xl border border-forest-green/25 bg-dark-card px-4 py-2">
        <summary className="cursor-pointer min-h-[48px] py-2 text-sm text-cream-muted">
          Dining ideas &amp; backups · {visibleItems.length} shortlists
        </summary>
        <p className="mb-4 text-sm text-cream-muted">Optional places to consider when you want another meal option.</p>

        <div className="space-y-3">
          {visibleItems.map((item) => (
            <details
              key={item.id}
              className="bg-dark-card rounded-lg border border-forest-green/30 p-4 group scroll-mt-20"
            >
              <summary className="list-none cursor-pointer flex items-start justify-between gap-3 min-h-[44px]">
                <div>
                  <h3 className="text-cream font-medium text-base">{item.title}</h3>
                  <p className="text-xs text-cream-muted/80 mt-1 uppercase tracking-[0.14em]">{item.area}</p>
                  <p className="text-sm text-cream-muted mt-2 leading-relaxed">{item.why}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-1 text-xs ${priorityClass(item.priority)}`}>
                  {item.priority}
                </span>
              </summary>
              <div className="mt-4 pt-4 border-t border-forest-green/20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {item.options.map((option) => (
                  <a
                    key={option.href}
                    href={option.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-forest-green/30 px-3 py-3 hover:border-amber/40 transition-colors min-h-[44px]"
                  >
                    <div className="text-amber text-sm font-medium leading-snug">{option.label}</div>
                    {option.note && <p className="text-xs text-cream-muted mt-2 leading-relaxed">{option.note}</p>}
                  </a>
                ))}
              </div>
            </details>
          ))}
        </div>
      </details>
    </section>
  )
}
