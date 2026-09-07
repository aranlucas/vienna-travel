'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { HOME_SECTION_IDS } from '@/lib/homeAnchors'
import { buildTimelineEvents } from '@/lib/timelineEvents'

const VIENNA_TIME_ZONE = 'Europe/Vienna'

function getViennaNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: VIENNA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  }
}

function formatEventTime(sortTime: number) {
  const hours24 = Math.floor(sortTime / 60)
  const minutes = sortTime % 60
  const suffix = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 || 12
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${suffix}`
}

export function FlyTonightCard() {
  const events = useMemo(() => buildTimelineEvents(), [])
  const [viennaNow, setViennaNow] = useState<{ date: string; minutes: number } | null>(null)

  useEffect(() => {
    const updateNow = () => setViennaNow(getViennaNow())
    updateNow()
    const interval = window.setInterval(updateNow, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  const nextEvent = useMemo(() => {
    if (!viennaNow) return null
    return events.find(
      (event) =>
        event.date > viennaNow.date || (event.date === viennaNow.date && event.sortTime >= viennaNow.minutes),
    )
  }, [events, viennaNow])

  if (!viennaNow || !nextEvent) return null

  const minutesAway =
    nextEvent.date === viennaNow.date ? Math.max(0, nextEvent.sortTime - viennaNow.minutes) : null
  const urgencyLabel =
    minutesAway !== null && minutesAway <= 120
      ? minutesAway === 0
        ? 'Happening now'
        : `Coming up in ${minutesAway < 60 ? `${minutesAway} min` : `${Math.floor(minutesAway / 60)}h ${minutesAway % 60}m`}`
      : nextEvent.date === viennaNow.date
        ? `Later today · ${formatEventTime(nextEvent.sortTime)}`
        : `Up next · ${nextEvent.dateLabel}`

  return (
    <section
      id={HOME_SECTION_IDS.flight}
      aria-label="Next important trip event"
      className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-8"
    >
      <div className="rounded-xl border border-amber/40 bg-amber/5 p-4 sm:p-5">
        <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-amber/90">{urgencyLabel}</div>
        <p className="mt-2 text-lg font-semibold leading-snug text-cream">{nextEvent.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-cream-muted">
          {nextEvent.dateLabel} · {formatEventTime(nextEvent.sortTime)}
          {nextEvent.subtitle ? ` · ${nextEvent.subtitle}` : ''}
        </p>
        {nextEvent.location && <p className="mt-1 text-sm text-cream-muted/70">{nextEvent.location}</p>}
        <div className="mt-4">
          <Link
            href="/timeline"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-amber px-4 py-3 text-sm font-semibold text-dark-surface transition-colors hover:bg-cream"
          >
            Open trip timeline
          </Link>
        </div>
      </div>
    </section>
  )
}
