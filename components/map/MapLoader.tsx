'use client'

import dynamic from 'next/dynamic'
import type { HeroMapProps } from './HeroMap'
import type { PhaseMapProps } from './PhaseMap'

const HeroMapDynamic = dynamic(() => import('./HeroMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-forest-green/10 animate-pulse flex items-center justify-center rounded-lg">
      <span className="text-cream-muted text-sm tracking-widest uppercase">Loading map…</span>
    </div>
  ),
})

const PhaseMapDynamic = dynamic(() => import('./PhaseMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-forest-green/10 animate-pulse rounded-lg" />,
})

export function HeroMap(props: HeroMapProps) {
  return <HeroMapDynamic {...props} />
}

export function PhaseMap(props: PhaseMapProps) {
  return <PhaseMapDynamic {...props} />
}
