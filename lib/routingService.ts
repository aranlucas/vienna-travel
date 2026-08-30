export type LatLng = [number, number]

const OSRM_BASE = 'https://router.project-osrm.org/route/v1'

/**
 * Fetch a road-following route between waypoints using the OSRM demo server.
 * Coordinates are [lat, lng] (Leaflet convention) — we convert to lng,lat for OSRM.
 */
export async function fetchDrivingRoute(waypoints: LatLng[]): Promise<LatLng[]> {
  if (waypoints.length < 2) return waypoints

  // OSRM expects lon,lat order
  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';')
  const url = `${OSRM_BASE}/driving/${coords}?overview=full&geometries=geojson`

  try {
    const res = await fetch(url)
    if (!res.ok) return waypoints
    const data = await res.json() as {
      routes?: Array<{ geometry: { coordinates: [number, number][] } }>
    }
    const coords2d = data.routes?.[0]?.geometry?.coordinates
    if (!coords2d?.length) return waypoints
    // Convert back to [lat, lng]
    return coords2d.map(([lng, lat]) => [lat, lng] as LatLng)
  } catch {
    return waypoints
  }
}

/**
 * Fetch a foot-hiking route using OSRM's foot profile.
 * Falls back to the provided waypoints if routing fails.
 */
export async function fetchHikingRoute(waypoints: LatLng[]): Promise<LatLng[]> {
  if (waypoints.length < 2) return waypoints

  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';')
  const url = `${OSRM_BASE}/foot/${coords}?overview=full&geometries=geojson`

  try {
    const res = await fetch(url)
    if (!res.ok) return waypoints
    const data = await res.json() as {
      routes?: Array<{ geometry: { coordinates: [number, number][] } }>
    }
    const coords2d = data.routes?.[0]?.geometry?.coordinates
    if (!coords2d?.length) return waypoints
    return coords2d.map(([lng, lat]) => [lat, lng] as LatLng)
  } catch {
    return waypoints
  }
}
