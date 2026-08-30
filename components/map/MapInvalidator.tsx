'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

/**
 * Fixes Leaflet blank-map bug when the map is inside a hidden container.
 * Calls map.invalidateSize() when the container becomes visible.
 *
 * Observes two targets:
 * 1. The map container itself.
 * 2. Up to 6 ancestor elements to catch any hidden-wrapper layout pattern.
 */
export function MapInvalidator() {
  const map = useMap()

  useEffect(() => {
    const handle = () => {
      // Small delay lets the browser apply layout before measuring tiles
      setTimeout(() => map.invalidateSize({ animate: false }), 50)
    }

    // Fire once on mount — covers the case where this tab is already active
    handle()

    const container = map.getContainer()
    const observer = new MutationObserver(handle)

    // Observe the container itself for direct visibility changes
    observer.observe(container, { attributes: true, attributeFilter: ['style'] })

    // Also walk up to 6 ancestors in case a parent controls visibility
    let el = container.parentElement
    for (let i = 0; i < 6 && el; i++) {
      observer.observe(el, { attributes: true, attributeFilter: ['style'] })
      el = el.parentElement
    }

    return () => observer.disconnect()
  }, [map])

  return null
}
