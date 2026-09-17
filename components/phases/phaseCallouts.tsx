import type { ReactNode } from 'react'

export interface PhaseCopy {
  title?: string
  subtitle?: string
  trainHeading?: string
  callouts: ReactNode
}

/** Phase-specific intro, headers, and callout boxes. Shared chrome lives in PhasePanel. */
export const PHASE_COPY: Record<string, PhaseCopy> = {
  vienna: {
    title: 'Imperial Vienna',
    callouts: (
      <>
        <p className="text-cream-muted text-base leading-relaxed">
          Cultural immersion and logistics. Vienna&apos;s grand boulevards, baroque palaces, and legendary coffeehouses
          set the stage before the mountains begin.
        </p>

        <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
          <div className="text-sm text-amber tracking-widest uppercase mb-2 font-medium">Arrival-day food stop</div>
          <p className="text-cream-muted text-base leading-relaxed">
            Saturday stalls close before a comfortable airport-to-hotel transfer is likely complete. Buy snacks at an
            open airport or station shop; market restaurants have separate hours.
          </p>
        </div>
      </>
    ),
  },
  salzkammergut: {
    title: 'Turquoise Lakes',
    callouts: (
      <>
        <p className="text-cream-muted text-base leading-relaxed">
          Train to Salzburg, pick up the rental car, and explore Austria&apos;s most photogenic lake district. September
          8 stays local: morning red train, then cycling and swimming in Strobl.
        </p>

        <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
          <div className="text-sm text-amber tracking-widest uppercase mb-2 font-medium">
            🚂 Schafbergbahn — Plan to book
          </div>
          <p className="text-cream-muted text-base leading-relaxed">
            Published daily service: 9:15 AM up (arrive 9:50), 12:05 PM down (arrive 12:40). €61 per adult return. Seats
            are not reserved; book both directions together.
          </p>
        </div>

        <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
          <div className="text-sm text-amber tracking-widest uppercase mb-2 font-medium">🚲 Afternoon bike + swim</div>
          <p className="text-cream-muted text-base leading-relaxed">
            Collect bikes in St. Wolfgang at 2:00 PM, ride the R2 to Strobl, and swim at Felmayerbad, Seestraße 8. Leave
            the beach at 4:30 PM and return bikes by 5:30 PM. Pro Travel is the first choice; See-Biker is the local
            fallback. Neither is booked.
          </p>
        </div>
      </>
    ),
  },
  tyrol: {
    callouts: (
      <>
        <p className="text-cream-muted text-base leading-relaxed">
          Three days based in Ehrwald at the foot of the Zugspitze. Suspension bridges, emerald alpine lakes, ghost-tree
          reflections, and a 9,718 ft summit straddling two countries.
        </p>

        <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
          <div className="text-sm text-amber tracking-widest uppercase mb-2 font-medium">
            Prioritize the best weather window
          </div>
          <p className="text-cream-muted text-base">
            Give Coburger Hütte the best safe day. If Thursday is wet and Friday improves, move the hike and skip
            Zugspitze. Carry cash as a payment backup for the hut.
          </p>
        </div>
      </>
    ),
  },
  olperer: {
    subtitle: 'Pertisau · Innsbruck',
    trainHeading: 'Train Home',
    callouts: (
      <>
        <p className="text-cream-muted text-base leading-relaxed">
          Drive to Pertisau at 9:30 AM for a short 20–30 minute flat lakeside stroll, then settle in for lunch and a
          café stop. Leave Pertisau at 2:30 PM and allow roughly 90 minutes for the return drive, plus buffer.
        </p>

        <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
          <div className="text-sm text-amber tracking-widest uppercase font-medium mb-2">🌿 Low-walking day</div>
          <p className="text-cream-muted text-base">
            Keep the lakeside stroll flat and short, with plenty of time seated for lunch and coffee.
          </p>
        </div>

        <div className="bg-dark-card border border-amber/20 rounded-lg p-4">
          <div className="text-sm text-amber tracking-widest uppercase font-medium mb-2">🚂 Sunday Train (Sept 13)</div>
          <p className="text-cream-muted text-base">
            RJX 13479 to Vienna Airport is <strong className="text-cream">booked in 1st class</strong> with seat
            reservations. Keep the confirmation offline and check the platform in ÖBB Scotty.
          </p>
        </div>

        <div className="bg-dark-card border border-red-900/40 rounded-lg p-4">
          <div className="text-sm text-red-400 tracking-widest uppercase font-medium mb-2">
            🅿️ Innsbruck Airport Return
          </div>
          <p className="text-cream-muted text-base">
            Leave Pertisau at 2:30 PM for the estimated 90-minute return drive, keeping buffer for traffic. Refuel by
            4:30 PM, reach the return area by 5:00 PM, and keep the confirmed{' '}
            <strong className="text-cream">SIXT airport return fixed at 5:30 PM</strong>. Follow the current branch
            signs and key-return instructions.
          </p>
        </div>
      </>
    ),
  },
}
