import fs from 'fs/promises'
import path from 'path'
import type { ElevationPoint } from './tripData'

export type LatLng = [number, number]

export interface GpxTrackData {
  coords: LatLng[]
  distanceKm: number
  elevationGainM: number
  elevationProfile: ElevationPoint[]
}

interface TrackPoint {
  lat: number
  lon: number
  ele: number
}

function haversineKm(a: TrackPoint, b: TrackPoint): number {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLon = (b.lon - a.lon) * Math.PI / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) *
      Math.cos(b.lat * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

function extractAttr(attrs: string, name: 'lat' | 'lon'): number | null {
  const match = attrs.match(new RegExp(`${name}="([\\d.-]+)"`))
  return match ? parseFloat(match[1]) : null
}

function extractElevation(body: string): number {
  const match = body.match(/<ele>(?:<!\[CDATA\[)?([\d.-]+)(?:\]\]>)?<\/ele>/)
  return match ? parseFloat(match[1]) : 0
}

function parseTrackPoints(content: string): TrackPoint[] {
  const matches = [...content.matchAll(/<trkpt\b([^>]*)>([\s\S]*?)<\/trkpt>/g)]
  return matches
    .map((match) => {
      const attrs = match[1]
      const lat = extractAttr(attrs, 'lat')
      const lon = extractAttr(attrs, 'lon')
      if (lat == null || lon == null) return null
      return { lat, lon, ele: extractElevation(match[2]) }
    })
    .filter((point): point is TrackPoint => point !== null)
}

function buildElevationProfile(points: TrackPoint[]): ElevationPoint[] {
  if (points.length === 0) return []

  let totalDistance = 0
  const cumulative = points.map((point, index) => {
    if (index > 0) totalDistance += haversineKm(points[index - 1], point)
    return {
      distance: totalDistance,
      elevation: Math.round(point.ele),
    }
  })

  const targetPoints = 18
  const step = Math.max(1, Math.floor(cumulative.length / targetPoints))
  const sampled = cumulative.filter((_, index) => index === 0 || index === cumulative.length - 1 || index % step === 0)

  return sampled.map((point) => ({
    distance: Math.round(point.distance * 10) / 10,
    elevation: point.elevation,
  }))
}

/**
 * Read a GPX file from public/gpx/ and extract route coordinates plus basic stats.
 * Runs on the server at build/render time — uses fs, not fetch.
 */
export async function readGpxTrackData(filename: string): Promise<GpxTrackData> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'gpx', filename)
    const content = await fs.readFile(filePath, 'utf-8')
    const points = parseTrackPoints(content)

    if (points.length === 0) {
      return { coords: [], distanceKm: 0, elevationGainM: 0, elevationProfile: [] }
    }

    let distanceKm = 0
    let elevationGainM = 0

    for (let i = 1; i < points.length; i++) {
      distanceKm += haversineKm(points[i - 1], points[i])
      const delta = points[i].ele - points[i - 1].ele
      if (delta > 0) elevationGainM += delta
    }

    return {
      coords: points.map((point) => [point.lat, point.lon] as LatLng),
      distanceKm: Math.round(distanceKm * 10) / 10,
      elevationGainM: Math.round(elevationGainM),
      elevationProfile: buildElevationProfile(points),
    }
  } catch {
    return { coords: [], distanceKm: 0, elevationGainM: 0, elevationProfile: [] }
  }
}
