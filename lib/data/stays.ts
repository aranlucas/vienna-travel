export interface StayWindow {
  isoDate: string
  label: string
  window: string
}

export interface Stay {
  id: string
  phaseId: string
  phaseLabel: string
  propertyName: string
  shortLabel: string
  bookingLabel: string
  address: string
  coordinates: { lat: number; lng: number }
  nights: number
  room: string
  guests: string
  checkIn: StayWindow
  checkOut: StayWindow
  /** True when reservation is confirmed; drives booked status in BOOKINGS. */
  confirmed: boolean
  /** Extra details shown in the timeline check-in event. */
  checkInDetails?: string[]
  /** Shown on unconfirmed bookings as a reminder note. */
  note?: string
  actionLabel?: string
  actionUrl?: string
}

export const STAYS: Stay[] = [
  {
    id: 'vienna',
    phaseId: 'vienna',
    phaseLabel: 'Phase 1 · Vienna',
    propertyName: 'Almanac Palais Vienna',
    shortLabel: 'Almanac',
    bookingLabel: 'Almanac Palais Vienna (Sept 5–7)',
    address: 'Vienna city centre',
    coordinates: { lat: 48.2029, lng: 16.3786 },
    nights: 2,
    room: 'Premium room, king bed',
    guests: '2 adults',
    checkIn: {
      isoDate: '2026-09-05',
      label: 'Saturday, September 5, 2026',
      window: '3:00 PM',
    },
    checkOut: {
      isoDate: '2026-09-07',
      label: 'Monday, September 7, 2026',
      window: '12:00 PM',
    },
    confirmed: true,
  },
  {
    id: 'zimmerbraeu',
    phaseId: 'salzkammergut',
    phaseLabel: 'Phase 2 · Salzkammergut',
    propertyName: 'Hotel Zimmerbräu',
    shortLabel: 'Zimmerbräu',
    bookingLabel: 'Hotel Zimmerbräu, St. Wolfgang (Sept 7–9)',
    address: 'St. Wolfgang, Austria',
    coordinates: { lat: 47.7377, lng: 13.4437 },
    nights: 2,
    room: '1 room',
    guests: '2 adults',
    checkIn: {
      isoDate: '2026-09-07',
      label: 'Monday, September 7, 2026',
      window: '3:00 PM - 6:00 PM',
    },
    checkOut: {
      isoDate: '2026-09-09',
      label: 'Wednesday, September 9, 2026',
      window: '8:00 AM - 11:00 AM',
    },
    confirmed: true,
  },
  {
    id: 'ehrwald',
    phaseId: 'tyrol',
    phaseLabel: 'Phase 3 · Tyrol',
    propertyName: 'der grüne Baum Mountain Boutique Hotel',
    shortLabel: 'grüne Baum',
    bookingLabel: 'der grüne Baum Mountain Boutique Hotel, Ehrwald (Sept 9–11)',
    address: 'Ehrwald, Austria',
    coordinates: { lat: 47.4009, lng: 10.9160 },
    nights: 2,
    room: 'Standard Double Room',
    guests: '2 adults',
    checkIn: {
      isoDate: '2026-09-09',
      label: 'Wednesday, September 9, 2026',
      window: '3:00 PM - 9:30 PM',
    },
    checkOut: {
      isoDate: '2026-09-11',
      label: 'Friday, September 11, 2026',
      window: '7:00 AM - 11:00 AM',
    },
    confirmed: true,
  },
  {
    id: 'innsbruck',
    phaseId: 'olperer',
    phaseLabel: 'Phase 4 · Olpererhütte & Return',
    propertyName: 'Urban Inn - Wilten 24/7',
    shortLabel: 'Urban Inn',
    bookingLabel: 'Urban Inn - Wilten 24/7, Innsbruck (Sept 11–13)',
    address: 'Innsbruck city centre',
    coordinates: { lat: 47.2596, lng: 11.3879 },
    nights: 2,
    room: 'Deluxe Studio',
    guests: '2 adults',
    checkIn: {
      isoDate: '2026-09-11',
      label: 'Friday, September 11, 2026',
      window: '3:00 PM',
    },
    checkOut: {
      isoDate: '2026-09-13',
      label: 'Sunday, September 13, 2026',
      window: '11:00 AM',
    },
    confirmed: true,
  },
  {
    id: 'nh-airport',
    phaseId: 'olperer',
    phaseLabel: 'Phase 4 · Return',
    propertyName: 'NH Vienna Airport',
    shortLabel: 'NH Airport',
    bookingLabel: 'NH Vienna Airport (Sept 13–14)',
    address: 'Vienna International Airport',
    coordinates: { lat: 48.1103, lng: 16.5697 },
    nights: 1,
    room: '1 room',
    guests: '2 adults',
    checkIn: {
      isoDate: '2026-09-13',
      label: 'Sunday, September 13, 2026',
      window: '3:00 PM',
    },
    checkOut: {
      isoDate: '2026-09-14',
      label: 'Monday, September 14, 2026',
      window: '12:00 PM',
    },
    confirmed: true,
    checkInDetails: ['Steps from Wien Flughafen station'],
  },
]

/** All confirmed stays. */
export const CONFIRMED_STAYS = STAYS.filter((s) => s.confirmed)

export const CONFIRMED_STAY_BY_ID: Record<string, Stay> = Object.fromEntries(
  CONFIRMED_STAYS.map((s) => [s.id, s])
)

export const STAYS_BY_ID: Record<string, Stay> = Object.fromEntries(
  STAYS.map((s) => [s.id, s])
)
