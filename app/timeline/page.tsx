import { TravelTimeline } from '@/components/timeline/TravelTimeline'
import { buildTimelineEvents } from '@/lib/timelineEvents'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trip Timeline | Austria Expedition 2026',
  description: 'Chronological travel timeline — flights, hotels, trains, and activities',
}

export default function TimelinePage() {
  const events = buildTimelineEvents()

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-forest-green/30 bg-dark-surface/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-cream-muted hover:text-cream transition-colors text-sm flex items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Trip Overview
          </Link>
          <h1 className="font-serif-display text-cream text-lg">Trip Timeline</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero */}
      <div className="mx-auto max-w-2xl px-4 pt-8 pb-4">
        <div className="mb-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-amber">Austria Expedition 2026</span>
        </div>
        <h2 className="font-serif-display text-3xl sm:text-4xl text-cream mb-2">Austria</h2>
        <p className="text-cream-muted text-base">Fri, Sep 4 &ndash; Mon, Sep 14, 2026</p>
        <p className="text-cream-muted/60 text-sm mt-1">Personal itinerary</p>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-2xl px-4">
        <div className="h-px bg-forest-green/30 my-4" />
      </div>

      {/* Timeline */}
      <div className="mx-auto max-w-2xl px-4 pb-16">
        <TravelTimeline events={events} />
      </div>
    </main>
  )
}
