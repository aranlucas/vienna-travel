"use client";

import dynamic from "next/dynamic";
import type { HeroMapProps } from "./hero-map";
import type { PhaseMapProps } from "./phase-map";

const HeroMapDynamic = dynamic(() => import("./hero-map"), {
  ssr: false,
  loading: () => (
    <div className="flex size-full animate-pulse items-center justify-center rounded-lg bg-forest-green/10">
      <span className="text-sm tracking-widest text-cream-muted uppercase">Loading map…</span>
    </div>
  ),
});

const PhaseMapDynamic = dynamic(() => import("./phase-map"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse rounded-lg bg-forest-green/10" />,
});

export function HeroMap(props: HeroMapProps) {
  return <HeroMapDynamic {...props} />;
}

export function PhaseMap(props: PhaseMapProps) {
  return <PhaseMapDynamic {...props} />;
}
