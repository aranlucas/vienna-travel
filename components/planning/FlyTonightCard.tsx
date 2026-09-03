import Link from 'next/link'
import { TRIP_DATA } from '@/lib/tripData'
import { HOME_SECTION_IDS } from '@/lib/homeAnchors'

const LH_CHECKIN = 'https://www.lufthansa.com/us/en/check-in'
const SEA_WAITS = 'https://www.portseattle.org/page/live-estimated-checkpoint-wait-times'

export function FlyTonightCard() {
  return (
    <section id={HOME_SECTION_IDS.flight} aria-label="Fly tonight" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-8">
      <div className="rounded-xl border border-amber/40 bg-amber/5 p-4 sm:p-5">
        <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-amber/90">Fly tonight · LH489</div>
        <p className="mt-2 text-lg font-semibold leading-snug text-cream">
          SEA → VIE · Sept 4, 6:50 PM PT · inside SEA by 3:50 PM PT
        </p>
        <p className="mt-1 text-sm leading-relaxed text-cream-muted">
          Check-in opens after 7:50 PM PT tonight · {TRIP_DATA.flight.flightNumbers.join(' + ')} via{' '}
          {TRIP_DATA.flight.layover} · In: {TRIP_DATA.flight.arrival.datetime}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <a
            href={LH_CHECKIN}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-amber px-4 py-3 text-sm font-semibold text-dark-surface transition-colors hover:bg-cream"
          >
            Check in with Lufthansa
          </a>
          <a
            href={SEA_WAITS}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-amber/40 px-4 py-3 text-sm font-semibold text-amber transition-colors hover:border-amber hover:text-cream"
          >
            SEA checkpoint waits
          </a>
          <Link
            href="/timeline"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-forest-green/40 bg-dark-card px-4 py-3 text-sm font-semibold text-cream transition-colors hover:border-amber/50"
          >
            Open trip timeline
          </Link>
        </div>
      </div>
    </section>
  )
}
