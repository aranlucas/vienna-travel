import { TravelTimeline } from "@/components/timeline/travel-timeline";
import { buildTimelineEvents } from "@/lib/timeline-events";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip Timeline | Austria Expedition 2026",
  description: "Chronological travel timeline — flights, hotels, trains, and activities",
};

export default function TimelinePage() {
  const events = buildTimelineEvents();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky inset-bs-0 z-20 border-be border-forest-green/30 bg-dark-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between p-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-cream-muted transition-colors hover:text-cream"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-4"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Trip Overview
          </Link>
          <h1 className="font-serif-display text-lg text-cream">Trip Timeline</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero */}
      <div className="mx-auto max-w-2xl px-4 pbs-8 pbe-4">
        <div className="mbe-2">
          <span className="text-caption-small font-medium tracking-heading text-amber uppercase">
            Austria Expedition 2026
          </span>
        </div>
        <h2 className="mbe-2 font-serif-display text-3xl text-cream sm:text-4xl">Austria</h2>
        <p className="text-base text-cream-muted">Fri, Sep 4 &ndash; Mon, Sep 14, 2026</p>
        <p className="mbs-1 text-sm text-cream-muted/60">Personal itinerary</p>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-2xl px-4">
        <div className="my-4 h-px bg-forest-green/30" />
      </div>

      {/* Timeline */}
      <div className="mx-auto max-w-2xl px-4 pbe-16">
        <TravelTimeline events={events} />
      </div>
    </main>
  );
}
