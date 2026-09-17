import type { Coordinates } from './trip'

export interface FlightSegment {
  id: string
  /** Which phase this segment belongs to (arrival/departure legs map to trip phases). */
  phaseId: string
  from: string
  to: string
  /** ISO date of departure, e.g. '2026-09-04' */
  date: string
  departureTime: string
  arrivalTime: string
  flightNumber: string
  airline: string
  /** Extra lines shown in timeline details */
  notes?: string[]
}

export const FLIGHT_SEGMENTS: FlightSegment[] = [
  {
    id: 'sea-muc',
    phaseId: 'vienna',
    from: 'SEA',
    to: 'MUC',
    date: '2026-09-04',
    departureTime: '6:50 PM',
    arrivalTime: '1:40 PM',
    flightNumber: 'LH489',
    airline: 'Lufthansa',
    notes: ['Booking details are kept with the traveler', 'Arrival: Sat, Sep 5, 1:40 PM CEST'],
  },
  {
    id: 'muc-vie',
    phaseId: 'vienna',
    from: 'MUC',
    to: 'VIE',
    date: '2026-09-05',
    departureTime: '3:30 PM',
    arrivalTime: '4:35 PM',
    flightNumber: 'OS186',
    airline: 'Austrian',
    notes: ['Lufthansa codeshare LH6390', 'Booking details are kept with the traveler', 'Arrival: 4:35 PM CEST'],
  },
  {
    id: 'vie-fra',
    phaseId: 'olperer',
    from: 'VIE',
    to: 'FRA',
    date: '2026-09-14',
    departureTime: '8:00 AM',
    arrivalTime: '9:30 AM',
    flightNumber: 'OS203',
    airline: 'Austrian',
    notes: ['Booking details are kept with the traveler', 'Arrival: 9:30 AM CEST'],
  },
  {
    id: 'fra-sea',
    phaseId: 'olperer',
    from: 'FRA',
    to: 'SEA',
    date: '2026-09-14',
    departureTime: '10:45 AM',
    arrivalTime: '11:55 AM PDT',
    flightNumber: 'LH490',
    airline: 'Lufthansa',
    notes: ['Booking details are kept with the traveler', 'Arrival: 11:55 AM PDT'],
  },
]

export interface LayoverSegment {
  id: string
  /** Which phase this layover belongs to (same phase as surrounding flight day). */
  phaseId: string
  airport: string
  city: string
  date: string
  /** Time layover begins (arrival of inbound flight) */
  time: string
  durationMinutes: number
}

export const LAYOVERS: LayoverSegment[] = [
  {
    id: 'layover-muc',
    phaseId: 'vienna',
    airport: 'MUC',
    city: 'Munich',
    date: '2026-09-05',
    time: '1:40 PM',
    durationMinutes: 110,
  },
  {
    id: 'layover-fra',
    phaseId: 'olperer',
    airport: 'FRA',
    city: 'Frankfurt',
    date: '2026-09-14',
    time: '9:30 AM',
    durationMinutes: 75,
  },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'] as const

function formatDurationMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

function formatFlightStamp(isoDate: string, time: string): string {
  const month = Number(isoDate.slice(5, 7))
  const day = Number(isoDate.slice(8, 10))
  return `${MONTHS[month - 1]} ${day}, ${time}`
}

/** Vienna-phase legs plus the connecting layover (SEA → VIE via MUC). */
export function getOutboundToVie() {
  const segments = FLIGHT_SEGMENTS.filter((segment) => segment.phaseId === 'vienna')
  const layover = LAYOVERS.find((segment) => segment.phaseId === 'vienna')
  const first = segments[0]
  const last = segments[segments.length - 1]
  if (!first || !last || !layover) {
    throw new Error('Outbound SEA→VIE requires vienna-phase flight segments and a layover')
  }
  const arrivalStamp = formatFlightStamp(last.date, last.arrivalTime)
  return {
    segments,
    layover,
    first,
    last,
    via: `${segments.map((segment) => segment.flightNumber).join(' + ')} via ${layover.airport} (${formatDurationMinutes(layover.durationMinutes)})`,
    departureStamp: formatFlightStamp(first.date, first.departureTime),
    arrivalStamp: last.date === first.date ? arrivalStamp : `${arrivalStamp} (+1)`,
  }
}

export interface DrivingSegment {
  id: string
  from: string
  to: string
  /** ISO date this segment is scheduled on */
  isoDate: string
  durationHours: number
  distanceKm: number
  toll?: { description: string; amountEur: number }
  scenic: boolean
  notes?: string
  /** Start, optional intermediates, and end coordinates for OSRM road routing */
  waypoints?: Coordinates[]
}

type DrivingSegmentData = DrivingSegment & { phaseId: string }

export const DRIVING_SEGMENTS: DrivingSegmentData[] = [
  {
    id: 'salzburg-to-lakes',
    from: 'SIXT Salzburg Centre/RadissonBlu (near Salzburg Hbf)',
    to: 'St. Wolfgang',
    isoDate: '2026-09-07',
    durationHours: 1.5,
    distanceKm: 80,
    scenic: true,
    notes:
      'Confirmed pickup: 12:00 PM at SIXT Salzburg Centre/RadissonBlu. Via Mondsee (Sound of Music church) then Attersee. Confirm the Austrian vignette is active before leaving.',
    waypoints: [
      { lat: 47.8129, lng: 13.0444 }, // Salzburg Hbf
      { lat: 47.8556, lng: 13.349 }, // Mondsee
      { lat: 47.9195, lng: 13.5307 }, // Attersee
      { lat: 47.7668, lng: 13.3664 }, // St. Gilgen
      { lat: 47.7377, lng: 13.4437 }, // St. Wolfgang
    ],
    phaseId: 'salzkammergut',
  },
  {
    id: 'lakes-to-lermoos',
    from: 'St. Wolfgang',
    to: 'Ehrwald',
    isoDate: '2026-09-09',
    durationHours: 4,
    distanceKm: 200,
    scenic: true,
    notes:
      'Scenic western route through Germany to Reutte and Ehrwald. Confirm the rental agreement allows the planned cross-border route. Stop at Highline179 and Plansee, but allow 4–4½ hours to Reutte including a break; shorten or omit Plansee if delayed. Hotel check-in ends at 21:30.',
    waypoints: [
      { lat: 47.7377, lng: 13.4437 }, // St. Wolfgang
      { lat: 47.8015, lng: 13.055 }, // Salzburg (pass through)
      { lat: 47.4851, lng: 10.7198 }, // Reutte / Highline179
      { lat: 47.4532, lng: 10.7372 }, // Plansee
      { lat: 47.4009, lng: 10.916 }, // Ehrwald
    ],
    phaseId: 'tyrol',
  },
  {
    id: 'ehrwald-to-innsbruck',
    from: 'Ehrwald',
    to: 'Innsbruck',
    isoDate: '2026-09-11',
    durationHours: 1.25,
    distanceKm: 35,
    scenic: false,
    notes: '2:30 PM — Short drive after Zugspitze visit. Check in to Urban Inn.',
    waypoints: [
      { lat: 47.4009, lng: 10.916 }, // Ehrwald
      { lat: 47.2636, lng: 11.4009 }, // Innsbruck
    ],
    phaseId: 'tyrol',
  },
  {
    id: 'innsbruck-to-pertisau',
    from: 'Innsbruck',
    to: 'Pertisau · Achensee',
    isoDate: '2026-09-12',
    durationHours: 1.25,
    distanceKm: 46,
    scenic: true,
    notes:
      'Leave Urban Inn at 09:30 after breakfast. Allow about 75 minutes including parking; this is a planning estimate, not live traffic. Use the signed lakeside parking in Pertisau and check motorway vignette coverage if navigating via the A12.',
    waypoints: [
      { lat: 47.2596, lng: 11.3879 }, // Urban Inn
      { lat: 47.4407, lng: 11.7025 }, // Pertisau lakeside
    ],
    phaseId: 'olperer',
  },
  {
    id: 'pertisau-to-innsbruck-airport',
    from: 'Pertisau · Achensee',
    to: 'Innsbruck Airport',
    isoDate: '2026-09-12',
    durationHours: 1.5,
    distanceKm: 52,
    scenic: false,
    notes:
      'Leave Pertisau at 14:30 and allow up to 90 minutes back toward Innsbruck, as a planning buffer rather than live traffic. Refuel around 16:30, aim for the return area by 17:00, and complete the confirmed SIXT handover by 17:30. Leave earlier if navigation shows delays.',
    waypoints: [
      { lat: 47.4407, lng: 11.7025 }, // Pertisau lakeside
      { lat: 47.2602, lng: 11.3439 }, // Innsbruck Airport
    ],
    phaseId: 'olperer',
  },
]

export interface TrainSegment {
  id: string
  from: string
  to: string
  /** ISO date this segment is scheduled on */
  isoDate: string
  operator: string
  departureTime?: string
  arrivalTime?: string
  durationHours: number
  distanceKm: number
  /** OSM route relation ID used to pre-bake exact rail geometry */
  relationId?: number
  notes?: string
  /** Key waypoints along the rail corridor */
  waypoints: Coordinates[]
  /** Optional researched links; planned is not a seat reservation. */
  links?: { label: string; href: string }[]
}

type TrainSegmentData = TrainSegment & { phaseId: string }

export const TRAIN_SEGMENTS: TrainSegmentData[] = [
  {
    id: 'schafberg-ascent',
    phaseId: 'salzkammergut',
    from: 'St. Wolfgang',
    to: 'Schafbergspitze',
    isoDate: '2026-09-08',
    operator: 'Schafbergbahn · planned, not booked',
    departureTime: '9:15 AM',
    arrivalTime: '9:50 AM',
    durationHours: 35 / 60,
    distanceKm: 5.85,
    waypoints: [],
    notes:
      'Published daily service A, April 25–November 1, 2026. Seats not confirmed. Book ascent and descent together; €61 adult return. Railway may change or cancel services.',
    links: [
      {
        label: 'Official 2026 timetable',
        href: 'https://www.5schaetze.at/content/dam/tourism/downloads/fahrpl%C3%A4ne/2026/sbb/en/2026_Fahrplan_SchafbergBahn__EN.pdf',
      },
    ],
  },
  {
    id: 'schafberg-descent',
    phaseId: 'salzkammergut',
    from: 'Schafbergspitze',
    to: 'St. Wolfgang',
    isoDate: '2026-09-08',
    operator: 'Schafbergbahn · planned, not booked',
    departureTime: '12:05 PM',
    arrivalTime: '12:40 PM',
    durationHours: 35 / 60,
    distanceKm: 5.85,
    waypoints: [],
    notes:
      'Published daily service A, April 25–November 1, 2026. Seats not confirmed. Book ascent and descent together; €61 adult return. Railway may change or cancel services.',
    links: [
      {
        label: 'Official 2026 timetable',
        href: 'https://www.5schaetze.at/content/dam/tourism/downloads/fahrpl%C3%A4ne/2026/sbb/en/2026_Fahrplan_SchafbergBahn__EN.pdf',
      },
    ],
  },
  {
    id: 'vienna-salzburg-rail',
    from: 'Wien Hbf',
    to: 'Salzburg Hbf',
    isoDate: '2026-09-07',
    operator: 'ÖBB Railjet',
    relationId: 3654420, // Wien Hbf → Zürich HB, Westbahn corridor
    durationHours: 2.25,
    distanceKm: 295,
    notes:
      'Sept 7. Leave the hotel around 7:45 AM and choose a Railjet scheduled to reach Salzburg by 11:00 AM, preserving at least 45 minutes before the confirmed noon SIXT pickup at Salzburg Centre/RadissonBlu near Hbf. Verify the final departure and platform in the ÖBB app. Scenery tip: westbound, try a left-side window for mountain views later in the run.',
    waypoints: [
      { lat: 48.1847, lng: 16.3765 }, // Wien Hbf
      { lat: 48.2047, lng: 15.6256 }, // St. Pölten Hbf
      { lat: 48.1219, lng: 14.8785 }, // Amstetten
      { lat: 48.2906, lng: 14.2932 }, // Linz Hbf
      { lat: 48.1598, lng: 14.0285 }, // Wels Hbf
      { lat: 48.0121, lng: 13.7214 }, // Attnang-Puchheim
      { lat: 47.8129, lng: 13.0444 }, // Salzburg Hbf
    ],
    phaseId: 'salzkammergut',
  },
  {
    id: 'innsbruck-vienna-airport-rail',
    from: 'Innsbruck Hbf',
    to: 'Flughafen Wien',
    isoDate: '2026-09-13',
    operator: 'ÖBB RJX 13479',
    relationId: 20060930, // Bregenz → Flughafen Wien, via DE (Kufstein–Rosenheim–Freilassing)
    departureTime: '14:48',
    arrivalTime: '19:57',
    durationHours: 5.15,
    distanceKm: 480,
    notes:
      'Sept 13. RJX 13479 — scheduled dep Innsbruck 14:48, direct to Vienna Airport (arr 19:57, no transfer). 1st class, 2 tickets. Keep passenger and reservation details with the traveler. Scenery tip: eastbound, try a right-side window for the alpine side between Innsbruck and Salzburg.',
    waypoints: [
      { lat: 47.2636, lng: 11.4009 }, // Innsbruck Hbf 14:48
      { lat: 47.3903, lng: 11.7714 }, // Jenbach
      { lat: 47.4882, lng: 12.0637 }, // Wörgl
      { lat: 47.5819, lng: 12.1636 }, // Kufstein
      { lat: 47.8558, lng: 12.1222 }, // Rosenheim (DE)
      { lat: 47.837, lng: 12.969 }, // Freilassing (DE/AT border)
      { lat: 47.8129, lng: 13.0444 }, // Salzburg Hbf
      { lat: 48.0121, lng: 13.7214 }, // Attnang-Puchheim
      { lat: 48.2906, lng: 14.2932 }, // Linz Hbf
      { lat: 48.2047, lng: 15.6256 }, // St. Pölten
      { lat: 48.1847, lng: 16.3765 }, // Wien Hbf
      { lat: 48.1197, lng: 16.5669 }, // Flughafen Wien 19:57
    ],
    phaseId: 'olperer',
  },
]
