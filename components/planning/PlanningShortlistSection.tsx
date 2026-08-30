import type { PlanningShortlistItem } from '@/lib/tripData'

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
  return (
    <section className="px-6 pb-16 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-8 bg-amber/60" />
        <span className="text-amber text-sm tracking-[0.3em] uppercase font-medium">Open Planning Shortlist</span>
      </div>
      <p className="text-cream-muted max-w-3xl text-base leading-relaxed mb-6">
        To keep the page readable, unresolved bookings and dining picks are grouped here as collapsible cards.
        Start with the two <span className="text-cream">Book now</span> items, then finish the reservation-only items.
      </p>

      <div className="space-y-3">
        {items.map((item) => (
          <details key={item.id} className="bg-dark-card rounded-lg border border-forest-green/30 p-4 group" open={item.priority === 'Book now'}>
            <summary className="list-none cursor-pointer flex items-start justify-between gap-3">
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
                  className="rounded-lg border border-forest-green/30 px-3 py-3 hover:border-amber/40 transition-colors"
                >
                  <div className="text-amber text-sm font-medium leading-snug">{option.label}</div>
                  {option.note && <p className="text-xs text-cream-muted mt-2 leading-relaxed">{option.note}</p>}
                </a>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
