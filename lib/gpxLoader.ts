import { gpx } from '@tmcw/togeojson'
import type { LineString } from 'geojson'

export type LatLng = [number, number]
export type GpxElevationPoint = { distance: number; elevation: number; lat: number; lng: number }

export async function loadGpxRoute(path: string): Promise<LatLng[]> {
  try {
    const res = await fetch(path)
    if (!res.ok) return []
    const text = await res.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'application/xml')
    const geojson = gpx(doc)

    const feature = geojson.features[0]
    if (!feature || feature.geometry.type !== 'LineString') return []

    const coords = (feature.geometry as LineString).coordinates
    return coords.map((c) => [c[1], c[0]] as LatLng)
  } catch {
    return []
  }
}

export async function loadGpxElevation(path: string): Promise<GpxElevationPoint[]> {
  try {
    const res = await fetch(path)
    if (!res.ok) return []
    const text = await res.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'application/xml')
    const geojson = gpx(doc)

    const feature = geojson.features[0]
    if (!feature || feature.geometry.type !== 'LineString') return []

    const coords = (feature.geometry as LineString).coordinates
    let totalDistance = 0

    return coords.map((coord: number[], i: number) => {
      if (i > 0) {
        const prev = coords[i - 1]
        const R = 111.32
        const dlatKm = (coord[1] - prev[1]) * R
        const dlngKm = (coord[0] - prev[0]) * R * Math.cos((prev[1] * Math.PI) / 180)
        totalDistance += Math.sqrt(dlatKm * dlatKm + dlngKm * dlngKm)
      }
      return {
        distance: Math.round(totalDistance * 10) / 10,
        elevation: coord[2] ?? 0,
        lat: coord[1],
        lng: coord[0],
      }
    })
  } catch {
    return []
  }
}
