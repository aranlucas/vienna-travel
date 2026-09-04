import { HeroSection } from '@/components/hero/HeroSection'
import { HeroMap } from '@/components/map/MapLoader'
import { PackingSection } from '@/components/packing/PackingSection'
import { FlyTonightCard } from '@/components/planning/FlyTonightCard'
import { PreDepartureChecklist } from '@/components/planning/PreDepartureChecklist'
import { CopyAddressButton } from '@/components/ui/CopyAddressButton'
import { MobileQuickNav } from '@/components/ui/MobileQuickNav'
import { TripChecksTimeline } from '@/components/planning/TripChecksTimeline'
import { TripCountdown } from '@/components/planning/TripCountdown'
import { PlanningShortlistSection } from '@/components/planning/PlanningShortlistSection'
import { LiveWeatherPage } from '@/components/weather/LiveWeatherProvider'
import { TripWeatherOutlook } from '@/components/weather/TripWeatherOutlook'
import { TripWebMcp } from '@/components/webmcp/TripWebMcp'
import { PhaseNav } from '@/components/phases/PhaseNav'
import { PhaseVienna } from '@/components/phases/PhaseVienna'
import { PhaseSalzkammergut } from '@/components/phases/PhaseSalzkammergut'
import { PhaseTyrol } from '@/components/phases/PhaseTyrol'
import { PhaseOlperer } from '@/components/phases/PhaseOlperer'
import { PHASES, TRIP_DATA, BOOKINGS, LIVE_CHECKS, PLANNING_SHORTLIST } from '@/lib/tripData'
import type { DayPlan } from '@/lib/tripData'
import type { LatLng } from '@/lib/routingService'
import { readGpxTrackData } from '@/lib/gpxServer'
import { assertStaticRoutesCurrent, STATIC_ROUTES } from '@/lib/staticRoutes'
import { CONFIRMED_STAYS } from '@/lib/confirmedStays'
import { buildGoogleMapsUrl } from '@/lib/mapLinks'
import { HOME_SECTION_IDS } from '@/lib/homeAnchors'

export default async function Home() {
  assertStaticRoutesCurrent()

  // ── Hero map data ────────────────────────────────────────────────
  // Drive: pre-baked OSRM coords (run scripts/prefetch-routes.ts to refresh)
  // Train: pre-baked OSM rail-relation geometry (no live map-service dependency).
  const heroDriveCoords = STATIC_ROUTES.heroDriveCoords
  const heroTrainRoutes = STATIC_ROUTES.heroTrainRoutes

  // ── Per-phase route data — GPX hiking routes only (driving from static JSON) ──
  const phaseRoutes = await Promise.all(
    PHASES.map(async (phase) => {
      const staticPhase = STATIC_ROUTES.phaseRoutes[phase.id as keyof typeof STATIC_ROUTES.phaseRoutes]
      const drivingRoutes = staticPhase.drivingRoutes

      const hikeResults = await Promise.all(
        phase.hikes.map(async (hike) => {
          const filename = hike.gpxFile.replace('/gpx/', '')
          const track = await readGpxTrackData(filename)
          const useGpxStats = hike.useGpxStats !== false
          return {
            hike: {
              ...hike,
              distanceKm: useGpxStats ? track.distanceKm || hike.distanceKm : hike.distanceKm,
              elevationGainM: useGpxStats ? track.elevationGainM || hike.elevationGainM : hike.elevationGainM,
              elevationProfile:
                useGpxStats && track.elevationProfile.length ? track.elevationProfile : hike.elevationProfile,
            },
            coords: hike.gpxStatus === 'reference' ? [] : track.coords,
          }
        }),
      )
      const hikingRoutes = Object.fromEntries(
        hikeResults.map(({ hike, coords }) => [hike.id, coords] as [string, LatLng[]]),
      ) as Record<string, LatLng[]>
      const hikes = hikeResults.map(({ hike }) => hike)

      return { phase: { ...phase, hikes }, drivingRoutes, hikingRoutes }
    }),
  )

  // ── Build phase panels (server JSX) ───────────────────────────
  const panels = phaseRoutes.map(({ phase, drivingRoutes, hikingRoutes }) => {
    switch (phase.id) {
      case 'vienna':
        return <PhaseVienna key={phase.id} phase={phase} drivingRoutes={drivingRoutes} hikingRoutes={hikingRoutes} />
      case 'salzkammergut':
        return (
          <PhaseSalzkammergut key={phase.id} phase={phase} drivingRoutes={drivingRoutes} hikingRoutes={hikingRoutes} />
        )
      case 'tyrol':
        return <PhaseTyrol key={phase.id} phase={phase} drivingRoutes={drivingRoutes} hikingRoutes={hikingRoutes} />
      case 'olperer':
        return <PhaseOlperer key={phase.id} phase={phase} drivingRoutes={drivingRoutes} hikingRoutes={hikingRoutes} />
      default:
        return null
    }
  })

  // Chronological across all phases — phases are defined in trip order
  const allDays: DayPlan[] = phaseRoutes.flatMap(({ phase }) => phase.days)

  return (
    <LiveWeatherPage staticDays={allDays}>
      <TripWebMcp
        trip={{
          title: TRIP_DATA.title,
          subtitle: TRIP_DATA.subtitle,
          dates: TRIP_DATA.dates,
          totalDays: TRIP_DATA.totalDays,
          travelers: TRIP_DATA.travelers,
        }}
        phases={PHASES.map(({ id, title, dates, subtitle }) => ({ id, title, dates, subtitle }))}
        days={allDays}
        bookings={BOOKINGS}
        liveChecks={LIVE_CHECKS}
      />

      {/* Hero */}
      <HeroSection />

      {/* Departure-eve action card — above the map so fly-tonight info is reachable */}
      <FlyTonightCard />

      {/* Full overview map — drive + train routes both pre-baked (scripts/prefetch-routes.ts) */}
      <section className="px-6 pb-12 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-amber/60" />
          <span className="text-amber text-sm tracking-[0.3em] uppercase font-medium">Full Route Overview</span>
        </div>
        <div className="w-full rounded-xl overflow-hidden border border-forest-green/30 shadow-2xl shadow-black/40 h-[280px] md:h-[480px]">
          <HeroMap driveCoords={heroDriveCoords} trainRoutes={heroTrainRoutes} />
        </div>
        <p className="text-cream-muted/50 text-sm mt-2 text-center">
          {TRIP_DATA.phases.length} phases · {TRIP_DATA.totalDays} days
        </p>
        <div className="mt-4 max-w-xl mx-auto">
          <TripCountdown
            label="Until flight departure from SEA (Sept 4, 2026 · 6:50 PM PT — inside SEA by 3:50 PM PT)"
            targetIso="2026-09-04T18:50:00-07:00"
          />
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="rounded-lg border border-slate-blue/25 bg-dark-card px-4 py-3 text-sm scroll-mt-20">
            <div className="text-[10px] uppercase tracking-[0.22em] text-amber/80 font-medium">Flight · LH489</div>
            <div className="mt-1 text-cream font-medium">
              {TRIP_DATA.flight.departure.airport} → {TRIP_DATA.flight.arrival.airport}
            </div>
            <div className="mt-1 text-cream-muted/70 leading-relaxed">
              {TRIP_DATA.flight.flightNumbers.join(' + ')} via {TRIP_DATA.flight.layover}
            </div>
            <div className="mt-2 space-y-1 text-cream-muted/80">
              <div>Out: {TRIP_DATA.flight.departure.datetime}</div>
              <div>In: {TRIP_DATA.flight.arrival.datetime}</div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <a
                href="https://www.lufthansa.com/us/en/check-in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-dark-surface transition-colors hover:bg-cream"
              >
                Check in with Lufthansa
              </a>
              <a
                href="https://www.flysea.com/travelers/security-line-waits"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-amber/35 px-4 py-2 text-sm font-medium text-amber transition-colors hover:text-cream"
              >
                SEA checkpoint waits
              </a>
            </div>
            <a
              href={buildGoogleMapsUrl('Vienna Airport', { lat: 48.1103, lng: 16.5697 })}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex min-h-[44px] items-center text-amber hover:text-cream transition-colors"
            >
              Open Vienna Airport in Google Maps
            </a>
          </div>
          {CONFIRMED_STAYS.map((stay) => (
            <details
              key={stay.id}
              className="rounded-lg border border-forest-green/25 bg-dark-card px-4 py-3 text-sm min-w-0"
            >
              <summary className="list-none cursor-pointer min-h-[44px] flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-amber/80 font-medium">
                    {stay.phaseLabel}
                  </div>
                  <div className="mt-0.5 text-cream font-medium leading-snug break-words">
                    {stay.propertyName} · {stay.nights}n
                  </div>
                </div>
                <a
                  href={buildGoogleMapsUrl(stay.propertyName, stay.coordinates)}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex min-h-[44px] items-center rounded-lg border border-forest-green/40 px-3 text-amber hover:text-cream transition-colors"
                >
                  Maps
                </a>
              </summary>
              <div className="mt-2 border-t border-forest-green/20 pt-2">
                <div className="text-cream-muted/70 leading-relaxed break-words">{stay.address}</div>
                <div className="mt-1 text-cream-muted/80">
                  {stay.room} · {stay.guests}
                </div>
                <div className="mt-2 space-y-1 text-cream-muted/80">
                  <div>
                    In: {stay.checkIn.label} · {stay.checkIn.window}
                  </div>
                  <div>
                    Out: {stay.checkOut.label} · {stay.checkOut.window}
                  </div>
                </div>
                <div className="mt-1">
                  <CopyAddressButton address={`${stay.propertyName}, ${stay.address}`} />
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Weather outlook — live forecasts per trip day */}
      <TripWeatherOutlook />

      {/* Phase navigation — panels pre-rendered server-side */}
      <section id={HOME_SECTION_IDS.itinerary} className="px-6 pb-20 max-w-6xl mx-auto scroll-mt-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-amber/60" />
          <span className="text-amber text-sm tracking-[0.3em] uppercase font-medium">The Itinerary</span>
        </div>
        <PhaseNav panels={panels} />
      </section>

      {/* Booking status — unbooked items first so the Sep 7 train can't be missed */}
      <section id={HOME_SECTION_IDS.bookingStatus} className="px-6 pb-16 max-w-6xl mx-auto scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-amber/60" />
          <span className="text-amber text-sm tracking-[0.3em] uppercase font-medium">Booking Status</span>
        </div>
        <div className="space-y-2 max-w-2xl">
          {[...BOOKINGS]
            .sort((a, b) => Number(a.booked) - Number(b.booked))
            .filter((b) => !b.booked)
            .map((b, i) => (
              <div
                key={`${b.item}-${i}`}
                className="flex gap-3 items-start p-3 rounded-lg border text-base bg-amber/5 border-amber/40 border-l-4 border-l-amber"
              >
                <span className="text-base shrink-0 mt-0.5 text-amber/60">○</span>
                <div className="flex-1 min-w-0">
                  <div className="leading-snug text-cream">{b.item}</div>
                  {(b.note || b.deadline) && (
                    <div className="flex flex-wrap gap-3 mt-1">
                      {b.deadline && <span className="text-sm text-amber/80 font-medium">⏰ {b.deadline}</span>}
                      {b.note && <span className="text-sm text-cream-muted/50">{b.note}</span>}
                    </div>
                  )}
                  {b.actionUrl && b.actionLabel && (
                    <a
                      href={b.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-dark-surface transition-colors hover:bg-cream"
                    >
                      {b.actionLabel}
                    </a>
                  )}
                </div>
              </div>
            ))}
          <details className="rounded-lg border border-forest-green/25 bg-dark-card px-4 py-3">
            <summary className="cursor-pointer list-none min-h-[44px] flex items-center text-cream-muted text-base">
              {BOOKINGS.filter((b) => b.booked).length} of {BOOKINGS.length} booked ✓ — show all
            </summary>
            <div className="mt-2 space-y-2 border-t border-forest-green/20 pt-3">
              {BOOKINGS.filter((b) => b.booked).map((b, i) => (
                <div key={`${b.item}-${i}`} className="flex gap-3 items-start text-base">
                  <span className="text-base shrink-0 mt-0.5 text-emerald-500">✓</span>
                  <div className="flex-1 min-w-0">
                    <div className="leading-snug text-cream-muted">{b.item}</div>
                    {(b.note || b.deadline) && (
                      <div className="flex flex-wrap gap-3 mt-1">
                        {b.deadline && <span className="text-sm text-amber/80 font-medium">⏰ {b.deadline}</span>}
                        {b.note && <span className="text-sm text-cream-muted/50">{b.note}</span>}
                      </div>
                    )}
                    {b.actionUrl && b.actionLabel && (
                      <a
                        href={b.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex min-h-[44px] items-center text-sm text-amber hover:text-cream transition-colors underline decoration-amber/40 underline-offset-4"
                      >
                        {b.actionLabel}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      <PlanningShortlistSection items={PLANNING_SHORTLIST} />

      <section id={HOME_SECTION_IDS.liveChecks} className="px-6 pb-16 max-w-6xl mx-auto scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-amber/60" />
          <span className="text-amber text-sm tracking-[0.3em] uppercase font-medium">Deadlines & Live Checks</span>
        </div>
        <p className="text-cream-muted max-w-3xl text-base leading-relaxed mb-6">
          The highest-variance parts of this itinerary are now pinned to concrete dates, so the access checks and
          reservation follow-ups happen before the tight logistics days arrive.
        </p>
        <TripChecksTimeline items={LIVE_CHECKS} />
      </section>

      <PackingSection packing={TRIP_DATA.packing} days={allDays} />

      {/* Pre-departure checklist — interactive with tonight-only filter */}
      <section id={HOME_SECTION_IDS.checklist} className="px-6 pb-20 max-w-6xl mx-auto scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-amber/60" />
          <span className="text-amber text-sm tracking-[0.3em] uppercase font-medium">Pre-Departure Checklist</span>
        </div>
        <div className="max-w-3xl">
          <PreDepartureChecklist items={TRIP_DATA.checklist} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-forest-green/20 px-6 py-8 pb-24 md:pb-8 text-center text-cream-muted/40 text-xs">
        Austria Expedition 2026 · Updated Sept 3, 2026 · Emergency in Austria: 112 (general) / 140 (mountain rescue)
      </footer>
      <MobileQuickNav />
    </LiveWeatherPage>
  )
}
