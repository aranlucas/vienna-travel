'use client'

import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-arrowheads'

export type ArrowOptions = Parameters<L.Polyline['arrowheads']>[0]

interface PolylineWithArrowsProps {
  positions: [number, number][]
  color: string
  weight?: number
  opacity?: number
  dashArray?: string
  arrows?: ArrowOptions
}

export function PolylineWithArrows({
  positions,
  color,
  weight = 3,
  opacity = 0.8,
  dashArray,
  arrows = { size: '8px', frequency: '100px', fill: true, yawn: 50 },
}: PolylineWithArrowsProps) {
  const map = useMap()
  const layerRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    if (!positions.length) return

    if (layerRef.current) {
      map.removeLayer(layerRef.current)
      layerRef.current = null
    }

    const polyline = L.polyline(positions, { color, weight, opacity, dashArray }).arrowheads({
      ...arrows,
      color,
    })

    polyline.addTo(map)
    layerRef.current = polyline

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, color, weight, opacity, dashArray])

  return null
}
