import type { Coordinates } from './trip'

// ── Flight segments ───────────────────────────────────────────────────────────

export interface FlightSegment {
  id: string
  /** Which phase this segment belongs to (arrival/departure legs map to trip phases). */
  phaseId: string
  from: string
  to: string
  /** ISO date of departure, e.g. '2037-09-04' */
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
    id: 'origin-muc',
    phaseId: 'vienna',
    from: 'ORIGIN',
    to: 'MUC',
    date: '2037-09-04',
    departureTime: '6:50 PM',
    arrivalTime: '1:40 PM',
    flightNumber: 'EX 100',
    airline: 'Example Air',
    notes: ['Fictional sample flight', 'Arrival: Sat, Sep 5, 1:40 PM CEST'],
  },
  {
    id: 'muc-vie',
    phaseId: 'vienna',
    from: 'MUC',
    to: 'VIE',
    date: '2037-09-05',
    departureTime: '3:30 PM',
    arrivalTime: '4:35 PM',
    flightNumber: 'EX 101',
    airline: 'Example Air',
    notes: ['Fictional sample flight', 'Arrival: 4:35 PM CEST'],
  },
  {
    id: 'vie-fra',
    phaseId: 'olperer',
    from: 'VIE',
    to: 'FRA',
    date: '2037-09-14',
    departureTime: '8:00 AM',
    arrivalTime: '9:30 AM',
    flightNumber: 'EX 200',
    airline: 'Example Air',
    notes: ['Fictional sample flight', 'Arrival: 9:30 AM CEST'],
  },
  {
    id: 'fra-origin',
    phaseId: 'olperer',
    from: 'FRA',
    to: 'ORIGIN',
    date: '2037-09-14',
    departureTime: '10:45 AM',
    arrivalTime: '11:55 AM',
    flightNumber: 'EX 201',
    airline: 'Example Air',
    notes: ['Fictional sample flight', 'Arrival: 11:55 AM local time'],
  },
]

// ── Layovers ──────────────────────────────────────────────────────────────────

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
    date: '2037-09-05',
    time: '1:40 PM',
    durationMinutes: 110,
  },
  {
    id: 'layover-fra',
    phaseId: 'olperer',
    airport: 'FRA',
    city: 'Frankfurt',
    date: '2037-09-14',
    time: '9:30 AM',
    durationMinutes: 75,
  },
]

// ── Driving segments ──────────────────────────────────────────────────────────

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
    from: 'rental car office near Salzburg Hbf',
    to: 'St. Wolfgang',
    isoDate: '2037-09-07',
    durationHours: 1.5,
    distanceKm: 80,
    scenic: true,
    notes:
      'Sample pickup: 12:00 PM near Salzburg Hbf. Via Mondsee, then Attersee. Confirm the Austrian vignette is active before leaving.',
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
    id: 'base-to-hallstatt',
    from: 'St. Wolfgang',
    to: 'Hallstatt',
    isoDate: '2037-09-08',
    durationHours: 0.75,
    distanceKm: 35,
    scenic: true,
    notes: 'Depart by 6:45 AM to arrive by 7:30 AM before tour buses.',
    waypoints: [
      { lat: 47.7377, lng: 13.4437 }, // St. Wolfgang
      { lat: 47.5622, lng: 13.6493 }, // Hallstatt
    ],
    phaseId: 'salzkammergut',
  },
  {
    id: 'hallstatt-to-st-wolfgang',
    from: 'Hallstatt',
    to: 'St. Wolfgang',
    isoDate: '2037-09-08',
    durationHours: 0.75,
    distanceKm: 30,
    scenic: true,
    notes:
      'Leave Hallstatt around 10:15 AM after the first Skywalk ascent, then return for the booked Schafbergbahn slot.',
    waypoints: [
      { lat: 47.5622, lng: 13.6493 }, // Hallstatt
      { lat: 47.7377, lng: 13.4437 }, // St. Wolfgang
    ],
    phaseId: 'salzkammergut',
  },
  {
    id: 'lakes-to-lermoos',
    from: 'St. Wolfgang',
    to: 'Ehrwald',
    isoDate: '2037-09-09',
    durationHours: 3,
    distanceKm: 200,
    scenic: true,
    notes:
      'Scenic western route through Germany to Reutte and Ehrwald. Confirm the rental agreement allows the planned cross-border route. Stop at Highline179 and Plansee, but shorten Plansee if needed to protect the 3:00 PM Ehrwald check-in.',
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
    isoDate: '2037-09-11',
    durationHours: 0.5,
    distanceKm: 35,
    scenic: false,
    notes: '2:30 PM — Short drive after the Zugspitze visit. Check in to the sample Innsbruck stay.',
    waypoints: [
      { lat: 47.4009, lng: 10.916 }, // Ehrwald
      { lat: 47.2636, lng: 11.4009 }, // Innsbruck
    ],
    phaseId: 'tyrol',
  },
  {
    id: 'innsbruck-to-schlegeis',
    from: 'Innsbruck',
    to: 'Schlegeis Reservoir',
    isoDate: '2037-09-12',
    durationHours: 1.5,
    distanceKm: 85,
    scenic: true,
    toll: { description: 'Schlegeis Alpine Road sample toll estimate', amountEur: 19 },
    notes:
      'Depart Innsbruck at 7:00 AM when the alpine road opens; target Schlegeis parking around 8:30 AM. Buy the day ticket online if possible and recheck parking / traffic-control status.',
    waypoints: [
      { lat: 47.2636, lng: 11.4009 }, // Innsbruck
      { lat: 47.0357, lng: 11.6637 }, // Schlegeis Reservoir
    ],
    phaseId: 'olperer',
  },
  {
    id: 'schlegeis-to-innsbruck',
    from: 'Schlegeis',
    to: 'Innsbruck Airport',
    isoDate: '2037-09-12',
    durationHours: 1.5,
    distanceKm: 80,
    scenic: false,
    notes: 'Sample schedule: leave Schlegeis by 2:30 PM for a 5:30 PM rental-car return at Innsbruck Airport.',
    waypoints: [
      { lat: 47.0357, lng: 11.6637 }, // Schlegeis Reservoir
      { lat: 47.2602, lng: 11.3439 }, // Innsbruck Airport
    ],
    phaseId: 'olperer',
  },
]

// ── Train segments ────────────────────────────────────────────────────────────

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
}

type TrainSegmentData = TrainSegment & { phaseId: string }

export const TRAIN_SEGMENTS: TrainSegmentData[] = [
  {
    id: 'vienna-salzburg-rail',
    from: 'Wien Hbf',
    to: 'Salzburg Hbf',
    isoDate: '2037-09-07',
    operator: 'ÖBB Railjet',
    relationId: 3654420, // Wien Hbf → Zürich HB, Westbahn corridor
    durationHours: 2.25,
    distanceKm: 295,
    notes:
      'Sample schedule: leave the hotel around 7:45 AM and choose a Railjet that reaches Salzburg by 11:00 AM, leaving at least 45 minutes before the noon rental-car pickup. Verify live times and the platform in the ÖBB app.',
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
    isoDate: '2037-09-13',
    operator: 'ÖBB Railjet',
    relationId: 20060930, // Bregenz → Flughafen Wien, via DE (Kufstein–Rosenheim–Freilassing)
    departureTime: '14:56',
    arrivalTime: '~19:55',
    durationHours: 5,
    distanceKm: 480,
    notes:
      'Fictional sample schedule: depart Innsbruck at 14:56 and travel directly to Vienna Airport, arriving around 19:55. Verify the live timetable before travel.',
    waypoints: [
      { lat: 47.2636, lng: 11.4009 }, // Innsbruck Hbf 14:56
      { lat: 47.3903, lng: 11.7714 }, // Jenbach 15:13
      { lat: 47.4882, lng: 12.0637 }, // Wörgl 15:27
      { lat: 47.5819, lng: 12.1636 }, // Kufstein
      { lat: 47.8558, lng: 12.1222 }, // Rosenheim (DE)
      { lat: 47.837, lng: 12.969 }, // Freilassing (DE/AT border)
      { lat: 47.8129, lng: 13.0444 }, // Salzburg Hbf 17:07
      { lat: 48.0121, lng: 13.7214 }, // Attnang-Puchheim
      { lat: 48.2906, lng: 14.2932 }, // Linz Hbf 18:17
      { lat: 48.2047, lng: 15.6256 }, // St. Pölten 19:03
      { lat: 48.1847, lng: 16.3765 }, // Wien Hbf 19:40
      { lat: 48.1197, lng: 16.5669 }, // Flughafen Wien ~19:55
    ],
    phaseId: 'olperer',
  },
]
