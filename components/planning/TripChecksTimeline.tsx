import type { LiveCheckItem } from '@/lib/tripData'

interface TripChecksTimelineProps {
  items: LiveCheckItem[]
}

function formatDueDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T12:00:00Z`))
}

export function TripChecksTimeline({ items }: TripChecksTimelineProps) {
  if (!items.length) return null

  const sorted = [...items].sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">
      {sorted.map((item) => {
        const accentClass =
          item.kind === 'Reservation'
            ? 'border-amber/20 bg-amber/4'
            : 'border-slate-blue/25 bg-slate-blue/8'

        return (
          <article key={item.id} className={`rounded-xl border p-4 ${accentClass}`}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-amber font-medium">
                {formatDueDate(item.dueDate)}
              </span>
              <span className="rounded-full border border-forest-green/30 bg-dark-card px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-cream-muted/80">
                {item.scope}
              </span>
              <span className="rounded-full border border-amber/20 bg-dark-card px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-cream-muted/80">
                {item.kind}
              </span>
            </div>
            <h3 className="font-serif-display text-xl text-cream leading-tight">{item.title}</h3>
            <p className="text-sm text-cream-muted mt-2 leading-relaxed">{item.description}</p>
            {item.note && (
              <p className="text-xs text-cream-muted/75 mt-3 leading-relaxed">{item.note}</p>
            )}
          </article>
        )
      })}
    </div>
  )
}
