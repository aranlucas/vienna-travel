import { HeroSection } from "@/components/hero/hero-section";
import { HeroMap } from "@/components/map/map-loader";
import { FlyTonightCard } from "@/components/planning/fly-tonight-card";
import { PreDepartureChecklist } from "@/components/planning/pre-departure-checklist";
import { CopyAddressButton } from "@/components/ui/copy-address-button";
import { MobileQuickNav } from "@/components/ui/mobile-quick-nav";
import { TripChecksTimeline } from "@/components/planning/trip-checks-timeline";
import { TripCountdown } from "@/components/planning/trip-countdown";
import { PlanningShortlistSection } from "@/components/planning/planning-shortlist-section";
import { LiveWeatherPage } from "@/components/weather/live-weather-provider";
import { TripWeatherOutlook } from "@/components/weather/trip-weather-outlook";
import { TripWebMcp } from "@/components/webmcp/trip-web-mcp";
import { PhaseNav } from "@/components/phases/phase-nav";
import { PhasePanel } from "@/components/phases/phase-panel";
import { PHASES, TRIP_DATA, BOOKINGS, LIVE_CHECKS, PLANNING_SHORTLIST } from "@/lib/tripData";
import type { DayPlan } from "@/lib/tripData";
import type { LatLng } from "@/lib/routing-service";
import { readGpxTrackData } from "@/lib/gpx-server";
import {
  assertStaticRoutesCurrent,
  STATIC_ROUTES,
  getStaticPhaseRoutes,
} from "@/lib/static-routes";
import { CONFIRMED_STAYS } from "@/lib/confirmedStays";
import { buildGoogleMapsUrl } from "@/lib/map-links";
import { HOME_SECTION_IDS } from "@/lib/home-anchors";
import { ThroughDate, TripProgressControl } from "@/components/planning/trip-progress";
import { getOutboundToVie } from "@/lib/data/transport";
import { VIENNA_AIRPORT } from "@/lib/data/trip";

const outbound = getOutboundToVie();

export default async function Home() {
  assertStaticRoutesCurrent();

  // Drive: pre-baked OSRM coords (run scripts/prefetch-routes.ts to refresh)
  // Train: pre-baked OSM rail-relation geometry (no live map-service dependency).
  const heroDriveCoords = STATIC_ROUTES.heroDriveCoords;
  const heroTrainRoutes = STATIC_ROUTES.heroTrainRoutes;

  const phaseRoutes = await Promise.all(
    PHASES.map(async (phase) => {
      const staticPhase = getStaticPhaseRoutes(phase.id);

      if (!staticPhase) {
        throw new Error(`Missing static route group for phase: ${phase.id}`);
      }

      const drivingRoutes = staticPhase.drivingRoutes;

      const hikeResults = await Promise.all(
        phase.hikes.map(async (hike) => {
          if (hike.gpxStatus === "reference") {
            return { hike, coords: [] satisfies LatLng[] };
          }

          const filename = hike.gpxFile.replace("/gpx/", "");
          const track = await readGpxTrackData(filename);

          return {
            hike: {
              ...hike,
              distanceKm: track.distanceKm || hike.distanceKm,
              elevationGainM: track.elevationGainM || hike.elevationGainM,
              elevationProfile: track.elevationProfile.length
                ? track.elevationProfile
                : hike.elevationProfile,
            },
            coords: track.coords,
          };
        }),
      );

      const hikingRoutes = Object.fromEntries(
        hikeResults.map(({ hike, coords }) => [hike.id, coords] satisfies HikingRouteEntry),
      );

      const hikes = hikeResults.map(({ hike }) => hike);

      return { phase: { ...phase, hikes }, drivingRoutes, hikingRoutes };
    }),
  );

  const panels = phaseRoutes.map(({ phase, drivingRoutes, hikingRoutes }) => (
    <PhasePanel
      key={phase.id}
      phase={phase}
      drivingRoutes={drivingRoutes}
      hikingRoutes={hikingRoutes}
    />
  ));

  // Chronological across all phases — phases are defined in trip order
  const allDays: DayPlan[] = phaseRoutes.flatMap(({ phase }) => phase.days);

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
      <div className="mx-auto max-w-6xl px-6">
        <TripProgressControl />
      </div>

      {/* Departure-eve action card — above the map so fly-tonight info is reachable */}
      <FlyTonightCard />

      {/* Full overview map — drive + train routes both pre-baked (scripts/prefetch-routes.ts) */}
      <section className="mx-auto max-w-6xl px-6 pbe-12">
        <div className="mbe-4 flex items-center gap-3">
          <div className="h-px w-8 bg-amber/60" />
          <span className="text-sm font-medium tracking-hero text-amber uppercase">
            Full Route Overview
          </span>
        </div>
        <div className="h-map-mobile w-full overflow-hidden rounded-xl border border-forest-green/30 shadow-2xl shadow-black/40 md:h-map-desktop">
          <HeroMap driveCoords={heroDriveCoords} trainRoutes={heroTrainRoutes} />
        </div>
        <p className="mbs-2 text-center text-sm text-cream-muted/50">
          {TRIP_DATA.phases.length} phases · {TRIP_DATA.totalDays} days
        </p>
        <ThroughDate date="2026-09-04">
          <div className="mx-auto mbs-4 max-w-xl">
            <TripCountdown
              label="Until flight departure from SEA (Sept 4, 2026 · 6:50 PM PT — inside SEA by 3:50 PM PT)"
              targetIso="2026-09-04T18:50:00-07:00"
            />
          </div>
        </ThroughDate>
        <div className="mbs-6 grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-4">
          <ThroughDate date="2026-09-05">
            <div className="scroll-mbs-20 rounded-lg border border-slate-blue/25 bg-dark-card px-4 py-3 text-sm">
              <div className="text-caption-small font-medium tracking-eyebrow-wide text-amber/80 uppercase">
                Flight · {outbound.first.flightNumber}
              </div>
              <div className="mbs-1 font-medium text-cream">
                {outbound.first.from} → {outbound.last.to}
              </div>
              <div className="mbs-1 leading-relaxed text-cream-muted/70">{outbound.via}</div>
              <div className="mbs-2 grid gap-y-1 text-cream-muted/80">
                <div>Out: {outbound.departureStamp}</div>
                <div>In: {outbound.arrivalStamp}</div>
              </div>
              <div className="mbs-3 grid grid-cols-1 gap-2">
                <a
                  href="https://www.lufthansa.com/us/en/check-in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-touch-roomy items-center justify-center rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-dark-surface transition-colors hover:bg-cream"
                >
                  Check in with Lufthansa
                </a>
                <a
                  href="https://www.flysea.com/travelers/security-line-waits"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-touch items-center justify-center rounded-lg border border-amber/35 px-4 py-2 text-sm font-medium text-amber transition-colors hover:text-cream"
                >
                  SEA checkpoint waits
                </a>
              </div>
              <a
                href={buildGoogleMapsUrl("Vienna Airport", VIENNA_AIRPORT)}
                target="_blank"
                rel="noreferrer"
                className="mbs-2 inline-flex min-h-touch items-center text-amber transition-colors hover:text-cream"
              >
                Open Vienna Airport in Google Maps
              </a>
            </div>
          </ThroughDate>
          {CONFIRMED_STAYS.map((stay) => (
            <ThroughDate key={stay.id} date={stay.checkOut.isoDate}>
              <details
                key={stay.id}
                className="min-w-0 rounded-lg border border-forest-green/25 bg-dark-card px-4 py-3 text-sm"
              >
                <summary className="flex min-h-touch cursor-pointer list-none items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-caption-small font-medium tracking-eyebrow-wide text-amber/80 uppercase">
                      {stay.phaseLabel}
                    </div>
                    <div className="mbs-0.5 leading-snug font-medium wrap-break-word text-cream">
                      {stay.propertyName} · {stay.nights}n
                    </div>
                  </div>
                  <a
                    href={buildGoogleMapsUrl(stay.propertyName, stay.coordinates)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-touch shrink-0 items-center rounded-lg border border-forest-green/40 px-3 text-amber transition-colors hover:text-cream"
                  >
                    Maps
                  </a>
                </summary>
                <div className="mbs-2 border-bs border-forest-green/20 pbs-2">
                  <div className="leading-relaxed wrap-break-word text-cream-muted/70">
                    {stay.address}
                  </div>
                  <div className="mbs-1 text-cream-muted/80">
                    {stay.room} · {stay.guests}
                  </div>
                  <div className="mbs-2 grid gap-y-1 text-cream-muted/80">
                    <div>
                      In: {stay.checkIn.label} · {stay.checkIn.window}
                    </div>
                    <div>
                      Out: {stay.checkOut.label} · {stay.checkOut.window}
                    </div>
                  </div>
                  <div className="mbs-1">
                    <CopyAddressButton address={`${stay.propertyName}, ${stay.address}`} />
                  </div>
                </div>
              </details>
            </ThroughDate>
          ))}
        </div>
      </section>

      {/* Weather outlook — live forecasts per trip day */}
      <TripWeatherOutlook />

      {/* Phase navigation — panels pre-rendered server-side */}
      <section
        id={HOME_SECTION_IDS.itinerary}
        className="mx-auto max-w-6xl scroll-mbs-20 px-6 pbe-20"
      >
        <div className="mbe-8 flex items-center gap-3">
          <div className="h-px w-8 bg-amber/60" />
          <span className="text-sm font-medium tracking-hero text-amber uppercase">
            The Itinerary
          </span>
        </div>
        <PhaseNav panels={panels} />
      </section>

      {/* Booking status — unbooked items first so the Sep 7 train can't be missed */}
      <section
        id={HOME_SECTION_IDS.bookingStatus}
        className="mx-auto max-w-6xl scroll-mbs-20 px-6 pbe-16"
      >
        <div className="mbe-6 flex items-center gap-3">
          <div className="h-px w-8 bg-amber/60" />
          <span className="text-sm font-medium tracking-hero text-amber uppercase">
            Booking Status
          </span>
        </div>
        <div className="grid max-w-2xl gap-y-2">
          {BOOKINGS.filter((b) => !b.booked).map((b) => (
            <ThroughDate key={b.item} date={b.endDate ?? "9999-12-31"}>
              <div
                key={b.item}
                className="flex items-start gap-3 rounded-lg border border-s-4 border-amber/40 border-s-amber bg-amber/5 p-3 text-base"
              >
                <span className="mbs-0.5 shrink-0 text-base text-amber/60">○</span>
                <div className="min-w-0 flex-1">
                  <div className="leading-snug text-cream">{b.item}</div>
                  {(Boolean(b.note) || Boolean(b.deadline)) && (
                    <div className="mbs-1 flex flex-wrap gap-3">
                      {b.deadline && (
                        <span className="text-sm font-medium text-amber/80">⏰ {b.deadline}</span>
                      )}
                      {b.note && <span className="text-sm text-cream-muted/50">{b.note}</span>}
                    </div>
                  )}
                  {b.actionUrl && b.actionLabel && (
                    <a
                      href={b.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mbs-2 inline-flex min-h-touch-roomy items-center justify-center rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-dark-surface transition-colors hover:bg-cream"
                    >
                      {b.actionLabel}
                    </a>
                  )}
                </div>
              </div>
            </ThroughDate>
          ))}
          <details className="rounded-lg border border-forest-green/25 bg-dark-card px-4 py-3">
            <summary className="flex min-h-touch cursor-pointer list-none items-center text-base text-cream-muted">
              {BOOKINGS.filter((b) => b.booked).length} of {BOOKINGS.length} booked ✓ — show all
            </summary>
            <div className="mbs-2 grid gap-y-2 border-bs border-forest-green/20 pbs-3">
              {BOOKINGS.filter((b) => b.booked).map((b) => (
                <div key={b.item} className="flex items-start gap-3 text-base">
                  <span className="mbs-0.5 shrink-0 text-base text-emerald-500">✓</span>
                  <div className="min-w-0 flex-1">
                    <div className="leading-snug text-cream-muted">{b.item}</div>
                    {(Boolean(b.note) || Boolean(b.deadline)) && (
                      <div className="mbs-1 flex flex-wrap gap-3">
                        {b.deadline && (
                          <span className="text-sm font-medium text-amber/80">⏰ {b.deadline}</span>
                        )}
                        {b.note && <span className="text-sm text-cream-muted/50">{b.note}</span>}
                      </div>
                    )}
                    {b.actionUrl && b.actionLabel && (
                      <a
                        href={b.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mbs-2 inline-flex min-h-touch items-center text-sm text-amber underline decoration-amber/40 underline-offset-4 transition-colors hover:text-cream"
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

      <section
        id={HOME_SECTION_IDS.liveChecks}
        className="mx-auto max-w-6xl scroll-mbs-20 px-6 pbe-16"
      >
        <div className="mbe-6 flex items-center gap-3">
          <div className="h-px w-8 bg-amber/60" />
          <span className="text-sm font-medium tracking-hero text-amber uppercase">
            Deadlines & Live Checks
          </span>
        </div>
        <p className="mbe-6 max-w-3xl text-base leading-relaxed text-cream-muted">
          Check the remaining access, transport and departure details here. Past checks follow the
          “Show past days” control, so today’s decisions stay easy to find.
        </p>
        <TripChecksTimeline items={LIVE_CHECKS} />
      </section>

      <PlanningShortlistSection items={PLANNING_SHORTLIST} />

      {/* Pre-departure checklist — interactive with tonight-only filter */}
      <ThroughDate date="2026-09-04">
        <section
          id={HOME_SECTION_IDS.checklist}
          className="mx-auto max-w-6xl scroll-mbs-20 px-6 pbe-20"
        >
          <div className="mbe-6 flex items-center gap-3">
            <div className="h-px w-8 bg-amber/60" />
            <span className="text-sm font-medium tracking-hero text-amber uppercase">
              Pre-Departure Checklist
            </span>
          </div>
          <div className="max-w-3xl">
            <PreDepartureChecklist items={TRIP_DATA.checklist} />
          </div>
        </section>
      </ThroughDate>

      {/* Footer */}
      <footer className="border-bs border-forest-green/20 px-6 py-8 pbe-24 text-center text-xs text-cream-muted/40 md:pbe-8">
        Austria Expedition 2026 · Updated Sept 12, 2026 · Emergency in Austria: 112 (general) / 140
        (mountain rescue)
      </footer>
      <MobileQuickNav />
    </LiveWeatherPage>
  );
}

type HikingRouteEntry = [string, LatLng[]];
