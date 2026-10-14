import type { ReactNode } from "react";

export interface PhaseCopy {
  title?: string;
  subtitle?: string;
  trainHeading?: string;
  callouts: ReactNode;
}

/** Phase-specific intro, headers, and callout boxes. Shared chrome lives in PhasePanel. */
type PhaseCopyCatalog = Record<string, PhaseCopy>;

export const PHASE_COPY = new Map<string, PhaseCopy>(
  Object.entries({
    vienna: {
      title: "Imperial Vienna",
      callouts: (
        <>
          <p className="text-base leading-relaxed text-cream-muted">
            Cultural immersion and logistics. Vienna&apos;s grand boulevards, baroque palaces, and
            legendary coffeehouses set the stage before the mountains begin.
          </p>

          <div className="rounded-lg border border-amber/20 bg-dark-card p-4">
            <div className="mbe-2 text-sm font-medium tracking-widest text-amber uppercase">
              Arrival-day food stop
            </div>
            <p className="text-base leading-relaxed text-cream-muted">
              Saturday stalls close before a comfortable airport-to-hotel transfer is likely
              complete. Buy snacks at an open airport or station shop; market restaurants have
              separate hours.
            </p>
          </div>
        </>
      ),
    },
    salzkammergut: {
      title: "Turquoise Lakes",
      callouts: (
        <>
          <p className="text-base leading-relaxed text-cream-muted">
            Train to Salzburg, pick up the rental car, and explore Austria&apos;s most photogenic
            lake district. September 8 stays local: morning red train, then cycling and swimming in
            Strobl.
          </p>

          <div className="rounded-lg border border-amber/20 bg-dark-card p-4">
            <div className="mbe-2 text-sm font-medium tracking-widest text-amber uppercase">
              🚂 Schafbergbahn — Plan to book
            </div>
            <p className="text-base leading-relaxed text-cream-muted">
              Published daily service: 9:15 AM up (arrive 9:50), 12:05 PM down (arrive 12:40). €61
              per adult return. Seats are not reserved; book both directions together.
            </p>
          </div>

          <div className="rounded-lg border border-amber/20 bg-dark-card p-4">
            <div className="mbe-2 text-sm font-medium tracking-widest text-amber uppercase">
              🚲 Afternoon bike + swim
            </div>
            <p className="text-base leading-relaxed text-cream-muted">
              Collect bikes in St. Wolfgang at 2:00 PM, ride the R2 to Strobl, and swim at
              Felmayerbad, Seestraße 8. Leave the beach at 4:30 PM and return bikes by 5:30 PM. Pro
              Travel is the first choice; See-Biker is the local fallback. Neither is booked.
            </p>
          </div>
        </>
      ),
    },
    tyrol: {
      callouts: (
        <>
          <p className="text-base leading-relaxed text-cream-muted">
            Three days based in Ehrwald at the foot of the Zugspitze. Suspension bridges, emerald
            alpine lakes, ghost-tree reflections, and a 9,718 ft summit straddling two countries.
          </p>

          <div className="rounded-lg border border-amber/20 bg-dark-card p-4">
            <div className="mbe-2 text-sm font-medium tracking-widest text-amber uppercase">
              Prioritize the best weather window
            </div>
            <p className="text-base text-cream-muted">
              Give Coburger Hütte the best safe day. If Thursday is wet and Friday improves, move
              the hike and skip Zugspitze. Carry cash as a payment backup for the hut.
            </p>
          </div>
        </>
      ),
    },
    olperer: {
      subtitle: "Pertisau · Innsbruck",
      trainHeading: "Train Home",
      callouts: (
        <>
          <p className="text-base leading-relaxed text-cream-muted">
            Drive to Pertisau at 9:30 AM for a short 20–30 minute flat lakeside stroll, then settle
            in for lunch and a café stop. Leave Pertisau at 2:30 PM and allow roughly 90 minutes for
            the return drive, plus buffer.
          </p>

          <div className="rounded-lg border border-amber/20 bg-dark-card p-4">
            <div className="mbe-2 text-sm font-medium tracking-widest text-amber uppercase">
              🌿 Low-walking day
            </div>
            <p className="text-base text-cream-muted">
              Keep the lakeside stroll flat and short, with plenty of time seated for lunch and
              coffee.
            </p>
          </div>

          <div className="rounded-lg border border-amber/20 bg-dark-card p-4">
            <div className="mbe-2 text-sm font-medium tracking-widest text-amber uppercase">
              🚂 Sunday Train (Sept 13)
            </div>
            <p className="text-base text-cream-muted">
              RJX 13479 to Vienna Airport is{" "}
              <strong className="text-cream">booked in 1st class</strong> with seat reservations.
              Keep the confirmation offline and check the platform in ÖBB Scotty.
            </p>
          </div>

          <div className="rounded-lg border border-red-900/40 bg-dark-card p-4">
            <div className="mbe-2 text-sm font-medium tracking-widest text-red-400 uppercase">
              🅿️ Innsbruck Airport Return
            </div>
            <p className="text-base text-cream-muted">
              Leave Pertisau at 2:30 PM for the estimated 90-minute return drive, keeping buffer for
              traffic. Refuel by 4:30 PM, reach the return area by 5:00 PM, and keep the confirmed{" "}
              <strong className="text-cream">SIXT airport return fixed at 5:30 PM</strong>. Follow
              the current branch signs and key-return instructions.
            </p>
          </div>
        </>
      ),
    },
  } satisfies PhaseCopyCatalog),
);
