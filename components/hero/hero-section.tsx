import Link from "next/link";
import { TRIP_DATA } from "@/lib/tripData";
import { HOME_SECTION_IDS } from "@/lib/home-anchors";

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pbs-16 pbe-6 md:pbs-24 md:pbe-8">
      {/* Eyebrow */}
      <div className="mbe-6 flex items-center gap-3">
        <div className="h-px w-8 bg-amber/60" />
        <span className="text-sm font-medium tracking-hero text-amber uppercase">
          {TRIP_DATA.travelers} Travelers · {TRIP_DATA.totalDays} Days
        </span>
        <Link
          href="/timeline"
          className="ms-auto rounded-full border border-amber/30 bg-amber/10 px-3 py-1.5 text-xs font-medium tracking-label text-amber uppercase transition-colors hover:bg-amber/20"
        >
          Trip Timeline
        </Link>
      </div>

      {/* Main title */}
      <h1 className="mbe-4 font-serif-display text-5xl leading-hero text-cream md:text-7xl lg:text-8xl">
        {TRIP_DATA.title}
        <br />
        <span className="text-amber italic">{TRIP_DATA.subtitle}</span>
      </h1>

      <p className="mbs-4 mbe-7 font-serif-body text-lg text-cream-muted md:mbe-8 md:text-xl">
        {TRIP_DATA.dates}
      </p>

      <div className="mbe-6 flex flex-wrap gap-2">
        <a
          href={`#${HOME_SECTION_IDS.flight}`}
          className="inline-flex min-h-touch items-center rounded-full border border-amber/40 bg-amber/10 px-4 py-2.5 text-xs font-medium tracking-label text-amber uppercase transition-colors hover:bg-amber/20"
        >
          Next Up
        </a>
        <a
          href={`#${HOME_SECTION_IDS.bookingStatus}`}
          className="inline-flex min-h-touch items-center rounded-full border border-forest-green/35 bg-dark-card px-4 py-2.5 text-xs font-medium tracking-label text-cream-muted uppercase transition-colors hover:border-amber/40 hover:text-cream"
        >
          Bookings
        </a>
        <a
          href={`#${HOME_SECTION_IDS.liveChecks}`}
          className="inline-flex min-h-touch items-center rounded-full border border-forest-green/35 bg-dark-card px-4 py-2.5 text-xs font-medium tracking-label text-cream-muted uppercase transition-colors hover:border-amber/40 hover:text-cream"
        >
          Live Checks
        </a>
        <a
          href={`#${HOME_SECTION_IDS.itinerary}`}
          className="inline-flex min-h-touch items-center rounded-full border border-forest-green/35 bg-dark-card px-4 py-2.5 text-xs font-medium tracking-label text-cream-muted uppercase transition-colors hover:border-amber/40 hover:text-cream"
        >
          Day by Day
        </a>
        <a
          href={`#${HOME_SECTION_IDS.weatherOutlook}`}
          className="inline-flex min-h-touch items-center rounded-full border border-forest-green/35 bg-dark-card px-4 py-2.5 text-xs font-medium tracking-label text-cream-muted uppercase transition-colors hover:border-amber/40 hover:text-cream"
        >
          Weather
        </a>
        <Link
          href="/packing"
          className="inline-flex min-h-touch items-center rounded-full border border-forest-green/35 bg-dark-card px-4 py-2.5 text-xs font-medium tracking-label text-cream-muted uppercase transition-colors hover:border-amber/40 hover:text-cream"
        >
          Packing
        </Link>
      </div>

      {/* Phase dots */}
      <div className="mbs-0 flex flex-wrap gap-2.5">
        {TRIP_DATA.phases.map((phase) => (
          <div
            key={phase.id}
            className="flex items-center gap-2 rounded-full border border-forest-green/30 bg-forest-green/20 px-3 py-1.5"
          >
            <span className="text-sm">{phase.emoji}</span>
            <span className="text-sm text-cream-muted">{phase.title}</span>
            <span className="text-sm text-amber/60">{phase.dates}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
