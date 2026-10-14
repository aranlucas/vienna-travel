import type { PackingPlan } from "@/lib/tripData";

interface PackingSectionProps {
  packing: PackingPlan;
}

const TONE_STYLES: Record<NonNullable<PackingPlan["groups"][number]["tone"]>, string> = {
  default: "bg-dark-card border-forest-green/25",
  info: "bg-slate-blue/12 border-slate-blue/30",
  warning: "bg-amber/5 border-amber/20",
};

export function PackingSection({ packing }: PackingSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 pbe-20">
      <div className="mbe-6 flex items-center gap-3">
        <div className="h-px w-8 bg-amber/60" />
        <span className="text-sm font-medium tracking-hero text-amber uppercase">
          {packing.title}
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-overview">
        <div className="rounded-xl border border-forest-green/30 bg-dark-card p-5">
          <p className="text-base leading-relaxed text-cream">{packing.intro}</p>

          <div className="mbs-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-amber/20 bg-amber/5 p-4">
              <div className="mbe-2 text-xs font-medium tracking-eyebrow-wide text-amber uppercase">
                Cabin Rule
              </div>
              <p className="text-sm leading-relaxed text-cream-muted">{packing.baggageRule}</p>
            </div>

            <div className="rounded-lg border border-slate-blue/30 bg-slate-blue/12 p-4">
              <div className="mbe-2 text-xs font-medium tracking-eyebrow-wide text-blue-200 uppercase">
                Pack Smart
              </div>
              <p className="text-sm leading-relaxed text-cream-muted">{packing.strategy}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber/20 bg-amber/5 p-5">
          <div className="mbe-2 text-xs font-medium tracking-eyebrow-wide text-amber uppercase">
            Why This Works
          </div>
          <ul className="grid gap-y-2 text-sm leading-relaxed text-cream-muted">
            <li>• Vienna still gets a proper dinner outfit, but only one.</li>
            <li>
              • Fleece + packable insulation + shell covers hot valleys through cold summit wind
              without a bulky coat.
            </li>
            <li>
              • Each personal item becomes a real daypack, so water, dry layers, and safety gear are
              split sensibly.
            </li>
            <li>• A Sept 9 laundry reset makes five underwear and sock rotations realistic.</li>
          </ul>
        </div>
      </div>

      <div className="mbs-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {packing.groups.map((group) => {
          const tone = group.tone ?? "default";

          return (
            <details key={group.title} className={`rounded-xl border p-4 ${TONE_STYLES[tone]}`}>
              <summary className="min-h-touch cursor-pointer list-none">
                <div className="mbe-1 flex items-start justify-between gap-2">
                  <h3 className="text-base font-medium text-cream">
                    {group.title}{" "}
                    <span className="text-sm font-normal text-cream-muted/60">
                      · {group.items.length} items
                    </span>
                  </h3>
                  <span className="mbs-1 shrink-0 text-xs text-cream-muted/60" aria-hidden="true">
                    ▾
                  </span>
                </div>
                {group.subtitle && (
                  <div className="mbs-1 text-xs tracking-label-wide text-cream-muted/60 uppercase">
                    {group.subtitle}
                  </div>
                )}
              </summary>

              <ul className="mbs-3 grid gap-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-cream-muted">
                    <span className="mbs-0.5 shrink-0 text-amber/60">•</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </section>
  );
}
