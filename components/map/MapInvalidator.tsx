'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

/**
 * Leaflet needs invalidateSize after the container has layout.
 * PhaseNav remounts phase panels, so ancestor display:none observation is unnecessary.
 */
export function MapInvalidator() {
  const map = useMap()

  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize({ animate: false }), 50)
    return () => clearTimeout(id)
  }, [map])

  return null
}
