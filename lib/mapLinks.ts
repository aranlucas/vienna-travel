import type { Coordinates } from './tripData'

export function buildGoogleMapsUrl(_name: string, coordinates: Coordinates, googleMapsUrl?: string): string {
  if (googleMapsUrl) return googleMapsUrl

  const query = encodeURIComponent(`${coordinates.lat},${coordinates.lng}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}
