'use client'

import type { DayActivity, DayPlan } from '@/lib/tripData'
import { useLiveWeatherDays } from '@/components/weather/LiveWeatherProvider'

interface DayEntryProps {
  day: DayPlan
  index: number
}

function ActivityBadge({ activity }: { activity: DayActivity }) {
  if (activity.highlight === 'important') {
    return (
      <span className="shrink-0 rounded-full border border-amber/30 bg-amber/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-amber">
        Important
      </span>
    )
  }

  if (activity.highlight === 'fun') {
    return (
      <span className="shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-300">
        Fun
      </span>
    )
  }

  return null
}

function DayEntry({ day }: DayEntryProps) {
  return (
    <div className="relative pl-10">
      {/* Dot */}
      <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-amber border-2 border-dark-surface shadow-lg" />

      <div className="bg-dark-card rounded-lg border border-forest-green/30 p-4 mb-4">
        <div className="mb-2">
          <span className="text-sm text-amber tracking-widest uppercase font-medium">
            {day.dayLabel}
          </span>
        </div>
        <h4 className="font-serif-display text-cream text-base mb-3">{day.title}</h4>

        {day.weather && (
          <div className="mb-3 rounded-lg border border-slate-blue/30 bg-slate-blue/12 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.22em] text-blue-200 font-medium">
              {day.weatherSource === 'forecast' ? 'Forecast Weather' : 'Typical Weather'}
            </div>
            <div className="text-sm text-cream mt-1 leading-snug">{day.weather}</div>
            {day.weatherNote && (
              <div className="text-xs text-cream-muted/80 mt-1 leading-relaxed">{day.weatherNote}</div>
            )}
          </div>
        )}

        {day.carryToday && day.carryToday.length > 0 && (
          <div className="mb-3 rounded-lg border border-forest-green/25 bg-forest-green/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-300 font-medium">
              What to Carry Today
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {day.carryToday.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-forest-green/30 bg-dark-surface/70 px-2 py-1 text-xs text-cream-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <ul className="space-y-2">
          {day.activities.map((activity, i) => (
            <li key={i} className="flex gap-2 text-base text-cream-muted">
              <span className="text-amber/50 mt-0.5 shrink-0">›</span>
              <div className="min-w-0 space-y-1">
                <span className="block leading-snug">
                  {activity.time ? `${activity.time} — ${activity.title}` : activity.title}
                </span>
                <ActivityBadge activity={activity} />
              </div>
            </li>
          ))}
        </ul>

        {day.accommodation && (
          <div className="mt-3 pt-3 border-t border-forest-green/20 flex items-center gap-2 text-sm text-cream-muted/70">
            <span>🛏</span>
            <span>{day.accommodation}</span>
          </div>
        )}

        {day.notes && (
          <div className="mt-2 text-sm text-amber/70 italic leading-relaxed">{day.notes}</div>
        )}
      </div>
    </div>
  )
}

interface DayTimelineProps {
  days: DayPlan[]
}

export function DayTimeline({ days }: DayTimelineProps) {
  const liveDays = useLiveWeatherDays(days)
  if (!liveDays.length) return null

  return (
    <div className="relative">
      {/* Vertical connecting line */}
      <div className="absolute left-[7px] top-4 bottom-4 w-px bg-amber/25" />
      <div className="space-y-0">
        {liveDays.map((day, i) => (
          <DayEntry key={day.date} day={day} index={i} />
        ))}
      </div>
    </div>
  )
}
