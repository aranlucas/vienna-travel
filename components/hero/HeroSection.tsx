import Link from 'next/link'
import { TRIP_DATA } from '@/lib/tripData'
import { HOME_SECTION_IDS } from '@/lib/homeAnchors'

export function HeroSection() {
  return (
    <section className="relative px-6 pt-16 pb-6 md:pt-24 md:pb-8 max-w-6xl mx-auto">
      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-8 bg-amber/60" />
        <span className="text-amber text-sm tracking-[0.3em] uppercase font-medium">
          {TRIP_DATA.travelers} Travelers · {TRIP_DATA.totalDays} Days
        </span>
        <Link
          href="/timeline"
          className="ml-auto rounded-full border border-amber/30 bg-amber/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-amber hover:bg-amber/20 transition-colors"
        >
          Trip Timeline
        </Link>
      </div>

      {/* Main title */}
      <h1 className="font-serif-display text-5xl md:text-7xl lg:text-8xl text-cream leading-[0.95] mb-4">
        {TRIP_DATA.title}
        <br />
        <span className="text-amber italic">{TRIP_DATA.subtitle}</span>
      </h1>

      <p className="font-serif-body text-cream-muted text-lg md:text-xl mt-4 mb-7 md:mb-8">{TRIP_DATA.dates}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href={`#${HOME_SECTION_IDS.flight}`}
          className="rounded-full border border-amber/40 bg-amber/10 px-4 py-2.5 min-h-[44px] inline-flex items-center text-xs font-medium uppercase tracking-[0.15em] text-amber hover:bg-amber/20 transition-colors"
        >
          Fly Tonight
        </a>
        <a
          href={`#${HOME_SECTION_IDS.bookingStatus}`}
          className="rounded-full border border-forest-green/35 bg-dark-card px-4 py-2.5 min-h-[44px] inline-flex items-center text-xs font-medium uppercase tracking-[0.15em] text-cream-muted hover:text-cream hover:border-amber/40 transition-colors"
        >
          Booking Queue
        </a>
        <a
          href={`#${HOME_SECTION_IDS.liveChecks}`}
          className="rounded-full border border-forest-green/35 bg-dark-card px-4 py-2.5 min-h-[44px] inline-flex items-center text-xs font-medium uppercase tracking-[0.15em] text-cream-muted hover:text-cream hover:border-amber/40 transition-colors"
        >
          Live Checks
        </a>
        <a
          href={`#${HOME_SECTION_IDS.checklist}`}
          className="rounded-full border border-forest-green/35 bg-dark-card px-4 py-2.5 min-h-[44px] inline-flex items-center text-xs font-medium uppercase tracking-[0.15em] text-cream-muted hover:text-cream hover:border-amber/40 transition-colors"
        >
          Preflight Checklist
        </a>
        <a
          href={`#${HOME_SECTION_IDS.weatherOutlook}`}
          className="rounded-full border border-forest-green/35 bg-dark-card px-4 py-2.5 min-h-[44px] inline-flex items-center text-xs font-medium uppercase tracking-[0.15em] text-cream-muted hover:text-cream hover:border-amber/40 transition-colors"
        >
          Weather
        </a>
        <a
          href={`#${HOME_SECTION_IDS.packing}`}
          className="rounded-full border border-forest-green/35 bg-dark-card px-4 py-2.5 min-h-[44px] inline-flex items-center text-xs font-medium uppercase tracking-[0.15em] text-cream-muted hover:text-cream hover:border-amber/40 transition-colors"
        >
          Packing
        </a>
      </div>

      {/* Phase dots */}
      <div className="flex flex-wrap gap-2.5 mt-0">
        {TRIP_DATA.phases.map((phase) => (
          <div
            key={phase.id}
            className="flex items-center gap-2 bg-forest-green/20 border border-forest-green/30 rounded-full px-3 py-1.5"
          >
            <span className="text-sm">{phase.emoji}</span>
            <span className="text-sm text-cream-muted">{phase.title}</span>
            <span className="text-sm text-amber/60">{phase.dates}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
