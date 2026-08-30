'use client'

import { useState } from 'react'
import type { TimelineEvent, TimelineEventType } from '@/lib/timelineEvents'

// ── Icon components ──

function FlightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  )
}

function HotelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
      <path d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14" />
      <path d="M9 21V13h6v8" />
      <path d="M3 21h18" />
    </svg>
  )
}

function TrainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
      <path d="M6 19l-2 3" />
      <path d="M18 19l2 3" />
    </svg>
  )
}

function LayoverIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
      <path d="M5 17h14v-5H5v5zM7 19a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM17 19a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
      <path d="M5 12l2-5h10l2 5" />
    </svg>
  )
}

function HikeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
      <path d="M13 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor" />
      <path d="M7 21l3-9 2.5 2 4.5-5" />
      <path d="M10 12l-3-3 7-4" />
    </svg>
  )
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  )
}

function getEventIcon(type: TimelineEventType) {
  switch (type) {
    case 'flight':
      return <FlightIcon />
    case 'layover':
      return <LayoverIcon />
    case 'hotel-checkin':
    case 'hotel-checkout':
      return <HotelIcon />
    case 'train':
      return <TrainIcon />
    case 'drive':
      return <CarIcon />
    case 'hike':
      return <HikeIcon />
    case 'activity':
      return <ActivityIcon />
  }
}

function getEventAccent(type: TimelineEventType): string {
  switch (type) {
    case 'flight':
      return 'border-blue-400/40 bg-blue-400/10 text-blue-300'
    case 'layover':
      return 'border-cream-muted/20 bg-cream-muted/5 text-cream-muted'
    case 'hotel-checkin':
      return 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
    case 'hotel-checkout':
      return 'border-amber/40 bg-amber/10 text-amber'
    case 'train':
      return 'border-purple-400/40 bg-purple-400/10 text-purple-300'
    case 'drive':
      return 'border-orange-400/40 bg-orange-400/10 text-orange-300'
    case 'hike':
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
    case 'activity':
      return 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
  }
}

function getDotColor(type: TimelineEventType): string {
  switch (type) {
    case 'flight':
      return 'bg-blue-400'
    case 'layover':
      return 'bg-cream-muted/50'
    case 'hotel-checkin':
      return 'bg-emerald-400'
    case 'hotel-checkout':
      return 'bg-amber'
    case 'train':
      return 'bg-purple-400'
    case 'drive':
      return 'bg-orange-400'
    case 'hike':
      return 'bg-emerald-500'
    case 'activity':
      return 'bg-cyan-400'
  }
}

function getLineColor(type: TimelineEventType): string {
  switch (type) {
    case 'flight':
      return 'bg-blue-400/30'
    case 'layover':
      return 'bg-cream-muted/15'
    case 'hotel-checkin':
      return 'bg-emerald-400/30'
    case 'hotel-checkout':
      return 'bg-amber/30'
    case 'train':
      return 'bg-purple-400/30'
    case 'drive':
      return 'bg-orange-400/30'
    case 'hike':
      return 'bg-emerald-500/30'
    case 'activity':
      return 'bg-cyan-400/30'
  }
}

function getTypeLabel(type: TimelineEventType): string {
  switch (type) {
    case 'flight': return 'Flight'
    case 'layover': return 'Layover'
    case 'hotel-checkin': return 'Check In'
    case 'hotel-checkout': return 'Check Out'
    case 'train': return 'Train'
    case 'drive': return 'Drive'
    case 'hike': return 'Hike'
    case 'activity': return 'Activity'
  }
}

function formatSortTime(sortTime: number): string {
  const normalizedMinutes = ((sortTime % 1440) + 1440) % 1440
  const hours24 = Math.floor(normalizedMinutes / 60)
  const minutes = normalizedMinutes % 60
  const ampm = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

// ── Event card ──

function TimelineCard({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const accent = getEventAccent(event.type)

  return (
    <div className="relative pl-24 sm:pl-28">
      {/* Time rail label */}
      <div className="absolute left-0 top-4 w-20 sm:w-24 text-right pr-3">
        <p className="text-xs font-semibold tracking-wide text-cream">{formatSortTime(event.sortTime)}</p>
      </div>

      {/* Rail markers */}
      <div className={`absolute left-[87px] sm:left-[103px] top-5 w-4 h-4 rounded-full ${getDotColor(event.type)} border-[3px] border-dark-surface shadow-lg`} />
      {!isLast && (
        <div className={`absolute left-[94px] sm:left-[110px] top-9 bottom-[-10px] w-px ${getLineColor(event.type)}`} />
      )}

      <div className={`rounded-2xl border ${accent} p-4 mb-1 shadow-sm`}>
        {/* Type badge + phase */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="opacity-70">{getEventIcon(event.type)}</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-70">
              {getTypeLabel(event.type)}
            </span>
          </div>
          {event.phaseId && (
            <span className="shrink-0 rounded-full border border-cream-muted/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cream-muted/80">
              {event.phaseId.replaceAll('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif-display text-cream text-lg leading-tight">{event.title}</h3>

        {/* Subtitle */}
        {event.subtitle && (
          <p className="text-sm text-cream-muted/80 mt-0.5">{event.subtitle}</p>
        )}

        {/* Details */}
        {event.details.length > 0 && (
          <div className="mt-2 space-y-1">
            {event.details.map((detail, i) => (
              <p key={i} className="text-sm text-cream-muted/75 leading-snug">{detail}</p>
            ))}
          </div>
        )}

        {/* Location */}
        {event.location && (
          <p className="mt-2 text-xs text-cream-muted/55 leading-snug">{event.location}</p>
        )}
      </div>
    </div>
  )
}

function TimelineSummary({ events }: { events: TimelineEvent[] }) {
  const flights = events.filter((e) => e.type === 'flight').length
  const hotels = events.filter((e) => e.type === 'hotel-checkin').length
  const trains = events.filter((e) => e.type === 'train').length
  const drives = events.filter((e) => e.type === 'drive').length

  const items = [
    { label: 'Events', value: events.length },
    { label: 'Flights', value: flights },
    { label: 'Hotels', value: hotels },
    { label: 'Trains', value: trains },
    { label: 'Drives', value: drives },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 sm:grid-cols-5 gap-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-forest-green/35 bg-dark-surface/60 px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream-muted/70">{item.label}</p>
          <p className="text-lg font-semibold text-cream">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

// ── Date header ──

function DateHeader({ label }: { label: string }) {
  return (
    <div className="sticky top-[60px] z-10 py-3 bg-dark-surface/90 backdrop-blur-sm">
      <h2 className="font-serif-display text-base font-bold text-cream tracking-wide">{label}</h2>
    </div>
  )
}

// ── Filter pills ──

const FILTER_OPTIONS: { type: TimelineEventType | 'all'; label: string }[] = [
  { type: 'all', label: 'All' },
  { type: 'flight', label: 'Flights' },
  { type: 'layover', label: 'Layovers' },
  { type: 'hotel-checkin', label: 'Hotels' },
  { type: 'train', label: 'Trains' },
  { type: 'drive', label: 'Drives' },
  { type: 'hike', label: 'Hikes' },
  { type: 'activity', label: 'Activities' },
]

// ── Main component ──

interface TravelTimelineProps {
  events: TimelineEvent[]
}

export function TravelTimeline({ events }: TravelTimelineProps) {
  const [filter, setFilter] = useState<TimelineEventType | 'all'>('all')

  const filtered = filter === 'all'
    ? events
    : events.filter((e) => {
        if (filter === 'hotel-checkin') return e.type === 'hotel-checkin' || e.type === 'hotel-checkout'
        return e.type === filter
      })

  // Group events by date
  const grouped: { date: string; label: string; events: TimelineEvent[] }[] = []
  for (const event of filtered) {
    const last = grouped[grouped.length - 1]
    if (last && last.date === event.date) {
      last.events.push(event)
    } else {
      grouped.push({ date: event.date, label: event.dateLabel, events: [event] })
    }
  }

  return (
    <div>
      <TimelineSummary events={events} />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            onClick={() => setFilter(opt.type)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
              filter === opt.type
                ? 'bg-amber text-dark-surface'
                : 'border border-forest-green/40 text-cream-muted hover:border-amber/40 hover:text-cream'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {grouped.map((group) => (
        <div key={group.date} className="mb-6">
          <DateHeader label={group.label} />
          <div className="space-y-3 pb-2">
            {group.events.map((event, eventIndex) => (
              <TimelineCard key={event.id} event={event} isLast={eventIndex === group.events.length - 1} />
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-cream-muted/50">
          No events match the selected filter.
        </div>
      )}
    </div>
  )
}
