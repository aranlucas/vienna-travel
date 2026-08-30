'use client'

import { useRef, useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipProps,
} from 'recharts'
import type { ElevationPoint } from '@/lib/tripData'
import { formatFeet, formatMiles, toFeet } from '@/lib/units'

interface ElevationChartProps {
  data: ElevationPoint[]
  height?: number
}

function CustomTooltip({ active, payload }: TooltipProps<number, string> & { payload?: { payload?: { distance?: number } }[] }) {
  if (!active || !payload?.length) return null
  const dist = payload[0]?.payload?.distance as number
  const elev = (payload[0] as { value?: number })?.value as number
  return (
    <div className="bg-dark-card border border-amber/30 rounded px-3 py-2 text-xs shadow-lg">
      <div className="text-cream-muted">{formatMiles(dist)}</div>
      <div className="text-amber font-medium">{formatFeet(elev)}</div>
    </div>
  )
}

export function ElevationChart({ data, height = 120 }: ElevationChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0
      setWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!data.length) return null

  const elevations = data.map((d) => d.elevation)
  const minEle = Math.min(...elevations)
  const maxEle = Math.max(...elevations)
  const padding = (maxEle - minEle) * 0.12

  return (
    <div ref={containerRef} className="w-full" style={{ height }}>
      {width > 0 && (
        <AreaChart width={width} height={height} data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d4a853" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#d4a853" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="#2a3a2a" vertical={false} />
          <XAxis
            dataKey="distance"
            tick={{ fill: '#c8c0b0', fontSize: 10 }}
            tickFormatter={(v: number) => formatMiles(v)}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#c8c0b0', fontSize: 10 }}
            tickFormatter={(v: number) => `${Math.round(toFeet(v)).toLocaleString()}ft`}
            axisLine={false}
            tickLine={false}
            width={52}
            domain={[minEle - padding, maxEle + padding]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="elevation"
            stroke="#d4a853"
            strokeWidth={2}
            fill="url(#elevGrad)"
          />
        </AreaChart>
      )}
    </div>
  )
}
