export interface Coordinates {
  lat: number
  lng: number
}

export const VIENNA_AIRPORT: Coordinates = { lat: 48.1103, lng: 16.5697 }

export const TRIP_META = {
  title: 'Austria Expedition',
  subtitle: 'Lakes & Hikes',
  dates: 'Sept 5–14, 2026',
  totalDays: 10,
  travelers: 2,
} as const
