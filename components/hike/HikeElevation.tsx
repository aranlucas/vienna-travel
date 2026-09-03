'use client'

import dynamic from 'next/dynamic'
import type { ElevationPoint } from '@/lib/tripData'

// Recharts is the heaviest client dependency on the page (~300KB+). Hike cards
// render below the fold inside phase tabs, so the chart chunk loads lazily on
// the client only when a hike card actually mounts — never in the initial bundle.
const ElevationChart = dynamic(() => import('./ElevationChart').then((module) => module.ElevationChart), {
  ssr: false,
  loading: () => <div className="w-full animate-pulse rounded bg-forest-green/15" style={{ height: 110 }} />,
})

interface HikeElevationProps {
  data: ElevationPoint[]
  height?: number
}

export function HikeElevation({ data, height = 110 }: HikeElevationProps) {
  if (!data.length) return null
  return <ElevationChart data={data} height={height} />
}
