import type { Coordinates } from './trip'

export type Difficulty = 'Easy' | 'Medium' | 'Medium-Hard' | 'Hard'

export interface ElevationPoint {
  distance: number
  elevation: number
}

export interface Hike {
  id: string
  name: string
  description: string
  start: Coordinates
  distanceKm: number
  elevationGainM: number
  difficulty: Difficulty
  gpxFile: string
  /** Whether the downloadable GPX exactly matches the timed itinerary route. */
  gpxStatus?: 'verified' | 'reference'
  /** When false, preserve declared itinerary stats instead of deriving them from the GPX. */
  useGpxStats?: boolean
  gpxDownloadLabel?: string
  elevationProfile: ElevationPoint[]
  highlights: string[]
  tips?: string
}

type HikeData = Hike & { phaseId: string }

export const HIKES: Record<string, HikeData> = {
  seebensee: {
    id: 'seebensee',
    name: 'Seebensee & Drachensee',
    description: 'Gondola-start alpine-lakes route from Ehrwalder Alm to Seebensee, Drachensee, and Coburger Hütte. The downloadable GPX is a separate valley-start reference and is not used on the phase map.',
    start: { lat: 47.3838, lng: 10.9560 },
    distanceKm: 13,
    elevationGainM: 580,
    difficulty: 'Medium-Hard',
    gpxFile: '/gpx/seebensee-drachensee.gpx',
    gpxStatus: 'reference',
    useGpxStats: false,
    gpxDownloadLabel: 'Download valley-start reference GPX',
    elevationProfile: [
      { distance: 0, elevation: 1502 },
      { distance: 1.5, elevation: 1560 },
      { distance: 3.2, elevation: 1657 },
      { distance: 4.6, elevation: 1740 },
      { distance: 6.5, elevation: 1917 },
      { distance: 8.4, elevation: 1740 },
      { distance: 9.8, elevation: 1657 },
      { distance: 11.5, elevation: 1560 },
      { distance: 13, elevation: 1502 },
    ],
    highlights: ['Seebensee alpine lake', 'Coburger Hütte', 'Emerald Drachensee', 'Zugspitze panorama'],
    tips: 'For Sept 10, follow the signed gondola-start route and save a matching offline map before departure. Do not use the valley-start reference GPX for itinerary timing. Order the Kaiserschmarrn at Coburger Hütte and bring €50+ cash.',
    phaseId: 'tyrol',
  },
  'three-lakes': {
    id: 'three-lakes',
    name: '3-Lake Loop (Biberwier)',
    description: 'Relaxed morning loop connecting three lakes: Blindsee, Mittersee, and Weißensee.',
    start: { lat: 47.3647, lng: 10.87525 },
    distanceKm: 9,
    elevationGainM: 350,
    difficulty: 'Medium',
    gpxFile: '/gpx/three-lakes-loop.gpx',
    elevationProfile: [
      { distance: 0, elevation: 993 },
      { distance: 0.5, elevation: 1037 },
      { distance: 1.1, elevation: 1074 },
      { distance: 1.7, elevation: 1087 },
      { distance: 2.7, elevation: 1100 },
      { distance: 3.8, elevation: 1197 },
      { distance: 4.9, elevation: 1236 },
      { distance: 6.0, elevation: 1208 },
      { distance: 7.2, elevation: 1108 },
      { distance: 8.4, elevation: 1002 },
      { distance: 9.0, elevation: 993 },
    ],
    highlights: ['Blindsee "ghost trees"', 'Mittersee', 'Weißensee', 'Zugspitze reflections'],
    phaseId: 'tyrol',
  },
  'olpererhuette-hike': {
    id: 'olpererhuette-hike',
    name: 'Trail 502 → Olpererhütte',
    description: 'The iconic Zillertal Alps hike. Famous suspension bridge with a perfect mirror reflection of the reservoir.',
    start: { lat: 47.03203, lng: 11.69734 },
    distanceKm: 6.2,
    elevationGainM: 784,
    difficulty: 'Medium-Hard',
    gpxFile: '/gpx/olpererhuette-trail502.gpx',
    elevationProfile: [
      { distance: 0, elevation: 1790 },
      { distance: 0.5, elevation: 1828 },
      { distance: 1.2, elevation: 1968 },
      { distance: 1.7, elevation: 2083 },
      { distance: 2.2, elevation: 2197 },
      { distance: 2.8, elevation: 2324 },
      { distance: 3.3, elevation: 2387 },
      { distance: 4.1, elevation: 2267 },
      { distance: 4.8, elevation: 2114 },
      { distance: 5.7, elevation: 1892 },
      { distance: 6.2, elevation: 1790 },
    ],
    highlights: ['Suspension bridge', 'Schlegeis Reservoir views', 'Zillertal panorama', 'Mountain hut lunch'],
    tips: 'Get THE photo on the suspension bridge with the reservoir behind you. Cash only at the hut (€100+ recommended).',
    phaseId: 'olperer',
  },
}
